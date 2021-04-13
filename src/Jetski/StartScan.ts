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

const fs = require('fs');
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// TODO JWT depend of blockchain
// TODO one thread by blockchain ?

// Verify : 6312038
// 6827717

// WE Start 4887870
// WE last 5027373

// eggs 6802595 6802639


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

                    jetski.getBlockContent(blockNumber, api)
                        .then(async remarks=>{
                            // Check if metadata exists
                            const rmrksWithMeta = await metaDataVerifier(remarks);

                            if(needRescan(rmrksWithMeta)){
                                toRescan.push(blockNumber);
                            }

                            const needDelay: boolean = rmrksWithMeta.length > 5;

                            if(rmrksWithMeta.length > 0){
                                // Gossip if array not empty
                                for(const rmrk of rmrksWithMeta){

                                    const gossip = new GossiperFactory(rmrk);
                                    const gossiper = await gossip.getGossiper();
                                    gossiper?.gossip();

                                    // if array have many rmrks, delay between calls
                                    if(needDelay){
                                        setTimeout(()=>{
                                            console.log("Wait for next gossip ...");
                                        }, 500)
                                    }

                                }
                            }
                            blockNumber ++;
                        }).catch(e=>{
                        console.error(e);

                        if(e == Jetski.noBlock){
                            // If block doesn't exists, wait and try again
                            console.log('Waiting for block ...');
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
    }, 1000 / 50)
}



// Hack for scan eggs, to be improved later
export async function eggs(opts?: Option, counter?: number, blockN?: number)
{
    let block: number = 0;
    let count: number = 0;

    if(opts){
        // @ts-ignore
        block = opts.block
    }else if(blockN && counter){
        block = blockN;
        count = counter;
    }

    const chain = new Kusama();

    // @ts-ignore
    // const count = opts.count;

    const jetski = new Jetski(chain);
    const api = await jetski.getApi();

    jetski.getBigBlock(block, api, count)
        .then( async (result)=>{

            const rmrks = await metaDataVerifier(result);

            let i: number = 0;

            let intervalLoop: NodeJS.Timeout = setInterval(async()=>{

                const gossip = new GossiperFactory(rmrks[i]);
                const gossiper = await gossip.getGossiper();
                gossiper?.gossip();
                i++;

                if(!rmrks[i]){
                    setTimeout(()=>{
                        // process.exit();
                    },5000);
                }

                if(i == 500){
                    clearInterval(intervalLoop);
                    console.log(count);
                    count ++;
                    eggs(undefined, count, block);
                }

            },1000);

            // for(const rmrk of rmrks){
            //     setTimeout(async ()=>{
            //         const gossip = new GossiperFactory(rmrk);
            //         const gossiper = await gossip.getGossiper();
            //         gossiper?.gossip();
            //     }, 1000);
            // }
        }).catch((e)=>{
            console.error(e);
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

        const needDelay: boolean = rmrks.length > 5

        for(const rmrk of rmrks){
            console.log(rmrk);
            const gossip = new GossiperFactory(rmrk);
            const gossiper = await gossip.getGossiper();
            gossiper?.gossip();

            if(needDelay){
                setTimeout(()=>{
                    console.log('Wait ...')
                }, 500);
            }
        }
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