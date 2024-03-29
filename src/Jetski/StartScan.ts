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
import {Entity} from "../Remark/Entities/Entity";
import {WestEnd} from "../Blockchains/WestEnd";
import {Polkadot} from "../Blockchains/Polkadot";
import {CompatibleBlockchains, CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {InstanceManager} from "../Instances/InstanceManager";
import {Transaction} from "../Remark/Transaction";
import {ChangeIssuer} from "../Remark/Interactions/ChangeIssuer";
import {Emote} from "../Remark/Interactions/Emote";
import {Consume} from "../Remark/Interactions/Consume";

const fs = require('fs');


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

    let entity: Entity|undefined;

    remarks.forEach((rmrk)=>{

        entity = rmrk.getEntity();

        if(entity && !entity.metaData){
            return true;
        }

    })

    return false;
}



export const startScanner = async (opts: Option)=>{
    // Launch jetski from yarn

    // @ts-ignore
    let chainName: string = opts.chain;
    let chain: Blockchain = getBlockchain(chainName);
    chainName = chain.constructor.name;

    console.log(chainName);

    // @ts-ignore
    let env: string = opts.env;

    // @ts-ignore
    let blockNumber = opts.block;

    const jetski = new Jetski(chain);
    let api: ApiPromise = await jetski.getApi();

    let currentBlock: number = 0;
    let blockSaved: string|void = "0";

    // Create instanceManager for saving blocks and check lock
    const jwt = GossiperFactory.getJwt(chainName, env);
    console.log(jwt);
    const canonize = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl, jwt: jwt} });
    const instanceManager = new InstanceManager(canonize, chainName, jwt);

    if(blockNumber == 0){
        // get last block saved on server
        blockSaved = await instanceManager.getLastBlock().catch(e=>{
            console.error(e);
        });

        if(blockSaved){
            blockNumber = Number(blockSaved);
        }else{
            console.error('Incorrect block number, please try with the --block={blockNumber} option');
            process.exit();
        }
    }else{
        blockSaved = instanceManager.getBlock();
    }

    // get new instance ID
    const id = InstanceManager.getNewInstanceCode();

    // check if lock exists on server
    const lockExists: boolean = await instanceManager.checkLockExists(chainName, id);

    if(!lockExists){
        startJetskiLoop(jetski, api, currentBlock, blockNumber, Number(blockSaved), chainName, id, instanceManager);

    }else{

        readline.question("Thread is actually locked, did you want to clear it ? All data about this instance will be lost (Y/n) ", async (answer: string)=>{

            answer = answer.toLowerCase();
            if(answer == "y" || answer == "yes"){

                try{
                    await instanceManager.resetInstance(chainName, id);
                }catch(e){
                    console.error(e);
                }

                startJetskiLoop(jetski, api, currentBlock, blockNumber, Number(blockSaved), chainName, id, instanceManager);

            }else{
                process.exit();
            }
        })

    }

}




export async function startJetskiLoop(jetski: Jetski, api: ApiPromise, currentBlock: number, blockNumber: number, lastBlockSaved: number, chain: string, id: number, instance: InstanceManager)
{

    // get jwt for blockchain
    // const jwt = GossiperFactory.getJwt(chain.toLowerCase());
    let instanceManager = instance;

    await instanceManager.startLock(blockNumber, id)
        .then(instanceSaved=>{
            if(instanceSaved != id.toString()){
                console.error("Something is wrong with the instance code");
                process.exit();
            }
        }).catch(e=>{
            console.error(e);
            setTimeout(()=>{}, 2000);
        });


    // Array of block without meta for rescan
    // let toRescan: Array<number> = [];
    let lockExists: boolean = true;

    process.on('exit', async ()=>{
        // Save last block when app is closing
        if(!InstanceManager.processExit){
            await instanceManager.exitProcess(blockNumber, id);
        }
    });

    process.on('SIGINT', async ()=>{
        // Save last block on exit Ctrl+C
        if(!InstanceManager.processExit){
            await instanceManager.exitProcess(blockNumber, id);
        }
    });

    // launch the loop on blocks
    let interval: NodeJS.Timeout = setInterval(async()=>{

        if (!api.isConnected) {

            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');

            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');

            startJetskiLoop(jetski, api, --currentBlock, blockNumber, lastBlockSaved, chain, id, instanceManager);

        }else{

            if(currentBlock != blockNumber){
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;

                if(blockNumber - lastBlockSaved > 99){
                    // Save block number each 100 blocks
                    try{
                        await instanceManager.saveLastBlock(chain, blockNumber, id);
                        lastBlockSaved = blockNumber;
                        // check if lock already exists
                        lockExists = await instanceManager.checkLockExists(chain, id);
                    }catch(e){
                        console.error(e);
                        console.error("Fail to save block")
                    }

                }

                // if(lockExists){
                    // if file lock exists, continue scan

                    // get remark objects from blockchain
                    jetski.getBlockContent(blockNumber, api)
                        .then(async remarks=>{

                            // Check if metadata exists
                            const rmrksWithMeta = await metaDataVerifier(remarks);

                            // if meta call fail, possible push for rescan later
                            // if(needRescan(rmrksWithMeta)){
                            //     toRescan.push(blockNumber);
                            // }

                            if(rmrksWithMeta.length > 0){
                                // Gossip if array not empty

                                // create canonize for send gossips
                                let canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: instanceManager.getJwt()} });
                                // blockchain object stock gossips
                                let blockchain = GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());

                                let gossip: GossiperFactory;
                                let gossiper: any;
                                let i: number = 0;
                                let sent: boolean = false;

                                for(const rmrk of rmrksWithMeta){

                                    const rmrkLength: number = rmrksWithMeta.length;
                                    const lastRmrk = i === rmrkLength - 1;

                                    sent = false;

                                    // create Event, Order or Entity Gossiper
                                    gossip = new GossiperFactory(rmrk, canonizeManager, blockchain);
                                    gossiper = await gossip.getGossiper();
                                    gossiper?.gossip();

                                    if(rmrkLength > Jetski.maxPerBatch){
                                        // send every Jetski.maxPerBatch remarks
                                        if(i != 0 && i % Jetski.maxPerBatch == 0 || lastRmrk){

                                            await sendGossip(canonizeManager, blockNumber, blockchain)
                                                .then(()=>{
                                                    // Refresh objects
                                                    canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl, jwt: instanceManager.getJwt()} });
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

                                    }else if(rmrkLength > Jetski.minForEggs || lastRmrk){

                                        if(i > 0 && i % Jetski.minForEggs == 0){
                                            await sendGossip(canonizeManager, blockNumber, blockchain).then(()=>{
                                                blockchain = GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
                                                sent = true;
                                            })
                                        }

                                    }else{
                                        // If there is less remarks than Jetski.maxPerBatch
                                        await sendGossip(canonizeManager, blockNumber, blockchain).then(()=>{
                                            sent = true;
                                        });
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
                            const canonize = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: instanceManager.getJwt()} });
                            instanceManager = new InstanceManager(canonize, chain, instanceManager.getJwt());
                            instanceManager.saveLastBlock(chain, blockNumber, id);

                            setTimeout(()=>{
                                currentBlock --;
                            }, 5000);

                        }else{
                            // If Entity doesn't exists in Interaction
                            // Probably because of non respect of version standards or special chars
                            blockNumber++;
                        }
                    });

                // }else{
                //     // else stop the scan
                //     await instanceManager.exitProcess(blockNumber, id);
                // }
            }
        }
    }, 1000/50)
}


async function sendGossip(canonizeManager: CSCanonizeManager, block: number, blockchain: any): Promise<string>
{
    return new Promise(async (resolve, reject)=>{
        if(blockchain){

            let sent: boolean = false;
            let errorMsg: string = "";

            const collectionEntities = canonizeManager.getAssetCollectionFactory().entityArray;
            const assetEntities = canonizeManager.getAssetFactory().entityArray;
            // const changeIssuerEntities = canonizeManager.getChangeIssuerFactory().entityArray;

            // Send if canonizer not empty
            if(collectionEntities.length > 0){
                await canonizeManager.gossipCollection()
                    .then((r: string)=>{
                        console.log(block+" collection : "+r);
                        sent = true;
                    }).catch((e: string)=>{
                        errorMsg += "\n collections : "+ e;
                        console.error(e);
                    });
            }


            if(assetEntities.length > 0){
                await canonizeManager.gossipOrbsBindings()
                    .then((r: string)=>{
                        console.log(block+" asset : "+r);
                        sent = true;
                    })
                    .catch((e: string)=>{
                        errorMsg += "\n assets : "+ e;
                        console.error(e);
                    });
            }

            // Send if canonizer not empty
            if(blockchain.eventFactory.entityArray.length > 0){
                await canonizeManager.gossipBlockchainEvents(blockchain).then((r: string)=>{
                    console.log(block+" event gossiped "+r);
                    sent = true;
                    resolve ("send");
                }).catch( async (e: string)=>{
                    console.error(e);
                    await canonizeManager.gossipBlockchainEvents(blockchain).then(()=>{
                        resolve ("send");
                    }).catch((e: string)=>{
                        errorMsg += "\n events : "+ e;
                    });
                });
            }

            if(blockchain.orderFactory.entityArray.length > 0){
                await canonizeManager.gossipBlockchainOrder(blockchain).then((r: string)=>{
                    console.log(block+" order gossiped "+r);
                    sent = true;
                    resolve ("send");
                }).catch( async (e: string)=>{
                    console.error(e);
                    await canonizeManager.gossipBlockchainOrder(blockchain).then(()=>{
                        resolve ("send");
                    }).catch((e: string)=>{
                        errorMsg += "\n events : "+ e;
                    });
                });
            }


            if(blockchain.emoteFactory.entityArray.length > 0){
                await canonizeManager.gossipBlockchainEmote(blockchain).then((r: string)=>{
                    console.log(block+" emote gossiped "+r);
                    sent = true;
                    resolve("send");
                }).catch(async (e: string)=>{
                    console.error(e);
                    await canonizeManager.gossipBlockchainEmote(blockchain).then(()=>{
                        resolve("send");
                    }).catch((e:string)=>{
                        errorMsg += "\n emotes : "+e;
                    })
                })
            }

            if(blockchain.changeIssuerFactory.entityArray.length > 0){
                await canonizeManager.gossipChangeIssuer(blockchain.changeIssuerFactory).then((r: string)=>{
                    console.log(block+" changeIssuer gossiped "+r);
                    sent = true;
                    resolve("send");
                }).catch(async (e: string)=>{
                    console.error(e);
                    await canonizeManager.gossipChangeIssuer(blockchain.changeIssuerFactory).then(()=>{
                        resolve("send");
                    }).catch((e: string)=>{
                        errorMsg += "\n changeIssuer : "+e;
                    })
                })
            }

            if(!sent && errorMsg != ""){
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

    let api: ApiPromise = await jetski.getApi();

    // @ts-ignore
    let env: string = opts.env;

    // @ts-ignore
    const blockN: number = opts.block;

    jetski.getBlockContent(blockN, api).then(async result=>{

        const rmrks = await metaDataVerifier(result);

        const chainName: string = chain.constructor.name.toLowerCase();

        // get jwt for blockchain
        const jwt = GossiperFactory.getJwt(chainName, env);
        // create canonize for stock gossips and flush it
        let canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} })
        // blockchain stock gossips too
        // let blockchain = GossiperFactory.getCanonizeChain(chainName, canonizeManager.getSandra());
        let blockchain = canonizeManager.getOrInitBlockchain(CompatibleBlockchains.kusama);

        let sent: boolean = false;
        let i: number = 0;

        for(const rmrk of rmrks){

            sent = false;
            const gossip = new GossiperFactory(rmrk, canonizeManager, blockchain);
            const gossiper = await gossip.getGossiper();

            // await gossiper?.gossip();
            //
            // const myGossiper = new Gossiper(blockchain.changeIssuerFactory);
            // const json = myGossiper.exposeGossip();
            // fs.writeFileSync("changeIssuer.json", JSON.stringify(json));
            // process.exit();

            await gossiper?.gossip();
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

        let rmrkToRecall: Array<Mint|MintNft> = [];
        let allRemarks : Array<Interaction> = [];

        let needRecall: boolean = false;

        for( const rmrk of remarks ){

            if(rmrk instanceof Mint || rmrk instanceof MintNft){
                let entity: Entity|undefined = rmrk.getEntity();

                if(!entity?.metaData){
                    needRecall = true;
                    rmrkToRecall.push(rmrk);
                }
            }else{
                allRemarks.push(rmrk);
            }
        }

        if(needRecall){
            let rmrkRecalled: Array<Interaction> = [];

            if(rmrkToRecall.length > 0){
                rmrkRecalled = await MetaData.getMetaOnArray(rmrkToRecall);
            }
            remarks = allRemarks.concat(rmrkRecalled);
        }

        resolve (remarks);
    })
}
