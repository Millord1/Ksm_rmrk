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


// Verify : 6312038
// 6802595


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



export const startScanner = async (opts: Option)=>{

    // Launch jetski from yarn

    // @ts-ignore
    let chain: Blockchain = getBlockchain(opts.chain);

    // @ts-ignore
    let blockNumber = opts.block;

    const jetski = new Jetski(chain);
    let api: ApiPromise = await jetski.getApi();

    let currentBlock: number = 0;

    startJetskiLoop(jetski, api, currentBlock, blockNumber);

}



function startJetskiLoop(jetski: Jetski, api: ApiPromise, currentBlock: number, blockNumber: number)
{
    // launch the loop on blocks
    let interval: NodeJS.Timeout =  setInterval(async()=>{

        if (!api.isConnected) {
            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');

            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');

            startJetskiLoop(jetski, api, --currentBlock, blockNumber);

        }else{

            if(currentBlock != blockNumber){
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;

                jetski.getBlockContent(blockNumber, api)
                    .then(async remarks=>{
                        // Check if metadata exists
                        const rmrksWithMeta = await metaDataVerifier(remarks);

                        if(rmrksWithMeta.length > 0){
                            // Gossip if array not empty
                            for(const rmrk of rmrksWithMeta){
                                const gossip = new GossiperFactory(rmrk);
                                const gossiper = await gossip.getGossiper();
                                gossiper?.gossip();
                            }
                        }
                        blockNumber ++;
                    }).catch(e=>{
                        if(e == Jetski.noBlock){
                            // If block doesn't exists, wait and try again
                            console.error(e);
                            console.log('Waiting for block ...');
                            setTimeout(()=>{
                                currentBlock --;
                            }, 5000);

                        }else if(e == Entity.undefinedEntity){
                            // If Entity doesn't exists in Interaction
                            // Probably because of non respect of version standards
                            blockNumber++;
                        }
                    });
            }
        }
    }, 1000 / 50)
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
        for(const rmrk of rmrks){
            console.log(rmrk);
            const gossip = new GossiperFactory(rmrk);
            const gossiper = await gossip.getGossiper();
            gossiper?.gossip();
        }
    });
}



async function metaDataVerifier(remarks: Array<Interaction>): Promise<Array<Interaction>>
{
    return new Promise(async (resolve)=>{

        for( const rmrk of remarks ){

            // loop for checking if meta exists
            if(rmrk instanceof Mint){

                if(rmrk.collection instanceof Collection && !rmrk.collection.metaData){
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