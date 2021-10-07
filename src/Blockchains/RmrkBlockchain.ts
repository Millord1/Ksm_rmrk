import {Blockchain} from "./Blockchain";
import {Transaction} from "../Remark/Transaction";
import {Interaction} from "../Remark/Interactions/Interaction";
import {Jetski} from "../Jetski/Jetski";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {Gossiper} from "canonizer/src/Gossiper";


const fs = require('fs');

export abstract class RmrkBlockchain extends Blockchain
{

    protected constructor(symbol: string, prefix: string, isSubstrate: boolean, wsProvider: string, decimale: number) {
        super(symbol, prefix, isSubstrate, wsProvider, decimale);
    }


    public async getBlockData(block: any, blockId: number, blockTimestamp: string, chain: Blockchain, jetski: Jetski): Promise<Array<any>>
    {
        return new Promise(async (resolve, reject)=>{

            let dataArray: Array<Promise<Interaction|string>> = []

            for (const ex of block.block ? block.block.extrinsics : []){

                const { method: {
                    args, method, section
                } } = ex;

                if(section === "timestamp" && method === "set"){
                    blockTimestamp = Jetski.getTimestamp(ex);
                }

                const dateTimestamp = Number(blockTimestamp) * 1000;
                const date = new Date(dateTimestamp);
                // Display block date and number
                console.log('block ' + blockId + ' ' + date);

                if(section === "system" && method === "remark"){
                    // If block have simple remark

                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    // Create transaction with block's info
                    const tx = new Transaction(blockId, hash, blockTimestamp, chain, signer);

                    if(remark.indexOf("") === 0){
                        // Create object from rmrk

                        dataArray.push(jetski.getObjectFromRemark(remark, tx));

                    }
                }

                if(section === "utility" && method.includes("batch")){
                    // If rmrks are in batch

                    const arg = args.toString();
                    const batch = JSON.parse(arg);

                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    let i = 1;

                    // if batch bigger than 200 rmrks
                    if(batch.length >= Jetski.minForEggs){
                        dataArray = await jetski.eggExplorer(batch, signer, hash, blockId, blockTimestamp, 0);
                    }else{
                        dataArray = await jetski.pushRemarks(batch, hash, blockId, blockTimestamp, signer, i, dataArray);
                    }
                }
            }

            Promise.all(dataArray).then(result =>{
                resolve(result);
            }).catch(r=>{
                reject(r);
                return;
            })
        })
    }


    public async sendGossip(canonizeManager: CSCanonizeManager, block: number, blockchain: any): Promise<string>
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


}
