import {Option} from "commander";
import {Blockchain} from "../Blockchains/Blockchain";
import {Kusama} from "../Blockchains/Kusama";
import {ApiPromise} from "@polkadot/api";
import {Jetski} from "./Jetski";
import {GossiperFactory} from "../Gossiper/GossiperFactory";
import {MetaData} from "../Remark/MetaData";
import {MintNft} from "../Remark/Interactions/MintNft";
import {Mint} from "../Remark/Interactions/Mint";
import {Interaction} from "../Remark/Interactions/Interaction";
import {Collection} from "../Remark/Entities/Collection";
import {Entity} from "../Remark/Entities/Entity";
import {Asset} from "../Remark/Entities/Asset";
import {WestEnd} from "../Blockchains/WestEnd";
import { Polkadot } from "../Blockchains/Polkadot";
import {FileManager} from "../Files/FileManager";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {EntityGossiper} from "../Gossiper/EntityGossiper";
import {EventGossiper} from "../Gossiper/EventGossiper";
import {InstanceGossiper} from "../Gossiper/InstanceGossiper";

const fs = require('fs');
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


function getBlockchain(chainName: string)
{

    switch(chainName.toLowerCase()){

        case "westend":
            return new WestEnd();

        case "polkadot":
            return new Polkadot();

        case "kusama":
        default:
            return new Kusama();

    }
}


function needRescan(remarks: Array<Interaction>)
{

    let entity: Entity;

    remarks.forEach((rmrk)=>{

        if(rmrk instanceof Mint && rmrk.collection){
            entity = rmrk.collection;
        }else if(rmrk instanceof MintNft && rmrk.asset){
            entity = rmrk.asset;
        }

        if(entity && !entity.metaData){
            return true;
        }

    })

    return false;
}



export const startScanner = async (opts: Option)=>{
    // Launch jetski from yarn

    // @ts-ignore
    const chainName = opts.chain;
    let chain: Blockchain = getBlockchain(chainName);

    console.log(chain.constructor.name);

    // @ts-ignore
    let blockNumber = opts.block;

    const jetski = new Jetski(chain);
    let api: ApiPromise = await jetski.getApi();

    let currentBlock: number = 0;
    let lastSave: number = 0;

    if(blockNumber == 0){
        blockNumber = FileManager.getLastBlock(chainName);
        if(!blockNumber){
            console.error('Incorrect block number, please try with the --block={blockNumber} option');
            process.exit();
        }
    }

    const id = Date.now() * 1000;

    if(!FileManager.checkLock(chainName, id)){
        // check if lock file exists

        startJetskiLoop(jetski, api, currentBlock, blockNumber, lastSave, chainName, id);

    }else{

        readline.question("Thread is actually locked, did you want to unlock ? (Y/n) ", (answer: string)=>{

            answer = answer.toLowerCase();

            if(answer == "y" || answer == "yes"){

                try{
                    fs.unlinkSync( path.resolve(FileManager.getThreadLockPath(chainName)) );
                }catch(e){
                    console.error(e);
                    console.log("Something is wrong, please delete manually Files/thread.lock.json")
                }

                startJetskiLoop(jetski, api, currentBlock, blockNumber, lastSave, chainName, id);

            }else{

                process.exit();
            }

        })


    }

}




export function startJetskiLoop(jetski: Jetski, api: ApiPromise, currentBlock: number, blockNumber: number, lastBlockSaved: number, chain: string, id: number)
{

    // generate file for lock one thread
    FileManager.startLock(blockNumber, chain, id);

    // get jwt for blockchain
    const jwt = GossiperFactory.getJwt(chain.toLowerCase());

    // Save block on gossip
    const canonize = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl, jwt: jwt} });
    const blockchain = GossiperFactory.getCanonizeChain(chain, canonize.getSandra());
    const instanceGossiper = new InstanceGossiper(blockchain, canonize);
    instanceGossiper.sendLastBlock(blockNumber, id);

    // Array of block without meta for rescan
    let toRescan: Array<number> = [];
    let lockExists: boolean = true;

    // launch the loop on blocks
    let interval: NodeJS.Timeout =  setInterval(async()=>{

        process.on('exit', ()=>{
            // Save last block when app is closing
            FileManager.exitProcess(blockNumber, chain, toRescan);
        });

        process.on('SIGINT', ()=>{
            // Save last block on exit Ctrl+C
            FileManager.exitProcess(blockNumber, chain, toRescan);
        });


        if (!api.isConnected) {

            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');

            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');

            startJetskiLoop(jetski, api, --currentBlock, blockNumber, lastBlockSaved, chain, id);

        }else{

            if(currentBlock != blockNumber){
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;

                if(lastBlockSaved == 0 || blockNumber - lastBlockSaved > 99){
                    // Save block number each 100 blocks

                    if(FileManager.saveLastBlock(blockNumber, chain)){
                        lastBlockSaved = blockNumber;
                        // check if lock file already exists
                        lockExists = FileManager.checkLock(chain, id);
                    }else{
                        console.error("Fail to save block")
                    }
                }

                if(lockExists){
                    // if file lock exists, continue scan

                    // get remark objects from blockchain
                    jetski.getBlockContent(blockNumber, api)
                        .then(async remarks=>{

                            console.log(remarks);

                            // Check if metadata exists
                            const rmrksWithMeta = await metaDataVerifier(remarks);

                            if(needRescan(rmrksWithMeta)){
                                toRescan.push(blockNumber);
                            }

                            if(rmrksWithMeta.length > 0){
                                // Gossip if array not empty

                                // create canonize for send gossips
                                let canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} });
                                // blockchain object stock gossips
                                let blockchain = GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());

                                let gossip: GossiperFactory;
                                let gossiper: EntityGossiper|EventGossiper|undefined;
                                let i: number = 0;
                                let sent: boolean = false;

                                for(const rmrk of rmrksWithMeta){

                                    sent = false;
                                    // create Event or Entity Gossiper
                                    gossip = new GossiperFactory(rmrk, canonizeManager, blockchain);
                                    gossiper = await gossip.getGossiper();
                                    gossiper?.gossip();

                                    // send every Jetski.maxPerBatch remarks
                                    if(i != 0 && i % Jetski.maxPerBatch == 0){

                                        await sendGossip(canonizeManager, blockNumber, blockchain)
                                            .then(()=>{
                                                // Refresh objects
                                                canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} });
                                                blockchain = GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
                                                sent = true;
                                            })
                                            .catch(async ()=>{
                                                await sendGossip(canonizeManager, blockNumber, blockchain)
                                                    .catch(()=>{
                                                        sent = false;
                                                    })
                                            });
                                        if(!sent){
                                            continue;
                                        }
                                    }
                                    i++;
                                }

                                if(!sent){
                                    await sendGossip(canonizeManager, blockNumber, blockchain);
                                }

                            }
                            blockNumber ++;
                        }).catch(e=>{
                        if(e != "no rmrk"){
                            console.error(e);
                        }

                        if(e == Jetski.noBlock){
                            // If block doesn't exists, wait and try again
                            console.log('Waiting for block ...');

                            // Save last block on gossip
                            const canonize = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} });
                            const blockchain = GossiperFactory.getCanonizeChain(chain, canonize.getSandra());
                            const instanceGossiper = new InstanceGossiper(blockchain, canonize);
                            instanceGossiper.sendLastBlock(blockNumber, id);

                            setTimeout(()=>{
                                currentBlock --;
                            }, 5000);

                        }else{
                            // If Entity doesn't exists in Interaction
                            // Probably because of non respect of version standards or special chars
                            blockNumber++;
                        }
                    });

                }else{
                    // else stop the scan
                    console.error("Lock file is apparently deleted, run will stop");
                    FileManager.exitProcess(blockNumber, chain, toRescan);
                }
            }
        }
    }, 1000/50)
}


async function sendGossip(canonizeManager: CSCanonizeManager,block: number, blockchain: any): Promise<string>
{

    return new Promise(async (resolve, reject)=>{
        if(blockchain){

            let sent: boolean = false;
            let errorMsg: string = "";

            await canonizeManager.gossipOrbsBindings()
                .then((r)=>{
                    console.log("asset : "+r);
                    console.log("asset gossiped " + block);
                    sent = true;
                })
                .catch((e)=>{
                    errorMsg += "\n assets : "+ e;
                    console.log(e + " or no assets");
                });

            await canonizeManager.gossipCollection()
                .then((r)=>{
                    console.log("collection : "+r);
                    console.log("collection gossiped " + block)
                    sent = true;
                }).catch((e)=>{
                    errorMsg += "\n collections : "+ e;
                    console.log(e + " or no collection");
                });


            await canonizeManager.gossipBlockchainEvents(blockchain).then((r)=>{
                console.log("events : "+r);
                console.log("event gossiped " + block);
                sent = true;
                resolve ("send");
            }).catch( async (e)=>{
                console.log(e + " or no events");
                await canonizeManager.gossipBlockchainEvents(blockchain).then(()=>{
                    resolve ("send");
                }).catch((e)=>{
                    errorMsg += "\n events : "+ e;
                });
            });

            if(!sent){
                reject (errorMsg);
            }else{
                resolve ("send");
            }

        }
    })

}


export const scan = async (opts: Option)=>{
    // scan only one block

    // @ts-ignore
    let chain : Blockchain = getBlockchain(opts.chain);
    const jetski = new Jetski(chain);

    const api: ApiPromise = await jetski.getApi();

    // @ts-ignore
    const blockN: number = opts.block;

    jetski.getBlockContent(blockN, api).then(async result=>{

        const rmrks = await metaDataVerifier(result);

        const chainName: string = chain.constructor.name.toLowerCase();

        // get jwt for blockchain
        const jwt = GossiperFactory.getJwt(chainName);
        // create canonize for stock gossips and flush it
        let canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} })
        // blockchain stock gossips too
        let blockchain = GossiperFactory.getCanonizeChain(chainName, canonizeManager.getSandra());

        let sent: boolean = false;
        let i: number = 0;

        for(const rmrk of rmrks){

            sent = false;

            const gossip = new GossiperFactory(rmrk, canonizeManager, blockchain);
            const gossiper = await gossip.getGossiper();
            gossiper?.gossip();
            i ++;

            if(i != 0 && i % Jetski.maxPerBatch == 0){

                await sendGossip(canonizeManager, blockN, blockchain).then(()=>{
                    // Refresh objects
                    canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} });
                    blockchain = GossiperFactory.getCanonizeChain(chainName, canonizeManager.getSandra());
                    sent = true;
                });
            }
        }
        if(!sent){
            await sendGossip(canonizeManager, blockN, blockchain);
        }

        setTimeout(()=>{
            process.exit();
        },2000);

    });

}



async function metaDataVerifier(remarks: Array<Interaction>): Promise<Array<Interaction>>
{
    return new Promise(async (resolve)=>{

        let entity: Entity;

        for( const rmrk of remarks ){

            // loop for checking if meta exists
            if(rmrk instanceof Mint){

                if(rmrk.collection instanceof Collection && !rmrk.collection.metaData){

                    entity = rmrk.collection;
                    // if meta doesn't exists, call
                     metaDataCaller(rmrk.collection)
                         .then((meta)=>{
                             // @ts-ignore rmrk.collection is instance of Collection
                             rmrk.collection.metaData = meta;
                         }).catch(e=>{
                             console.error(e);
                     })
                }

            }else if (rmrk instanceof MintNft){

                if(rmrk.asset instanceof Asset && !rmrk.asset.metaData){

                    // if meta doesn't exists, call
                    metaDataCaller(rmrk.asset)
                        .then((meta)=>{
                            // @ts-ignore rmrk.asset is instance of Asset
                            rmrk.asset.metaData = meta;
                        }).catch((e)=>{
                            console.error(e);
                    })
                }

            }

        }
        resolve (remarks);
    })
}



async function metaDataCaller(entity: Entity, nbOfTry: number = 0): Promise<MetaData>
{
    return new Promise((resolve, reject)=>{

        if(entity.url){
            // verify url existst
            MetaData.getMetaData(entity.url)
                .then(metaData=>{
                    resolve (metaData);
                }).catch(e=>{

                    if(nbOfTry < 2){
                        // try a second call meta if the first fail
                        setTimeout(()=>{
                            metaDataCaller(entity, nbOfTry++);
                        }, 500);
                    }else{
                        // if 2 calls meta are failed, reject
                        reject(e);
                    }

                })
        }

    })
}



export const test = ()=>{
    console.log("Hello World");
}