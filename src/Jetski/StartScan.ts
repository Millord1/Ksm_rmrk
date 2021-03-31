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
import {Global} from "../globals";

const fs = require('fs');
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


const threadLock: string = "src/Files/thread.lock.json"
const save: string = "_lastBlock.json";

// Verify : 6312038
// 6827717

// WE Start 4887870
// WE last 4990872

// TODO TEST read in folder
// TODO write file server on node

// TODO save block without meta in Global array for writing on exit
// TODO check if .lock already exists for continue scan

function startLock(startBlock: number, chain: string)
{
    // create file for lock one thread

    const dateTimestamp = Date.now() * 1000;
    const date = new Date(dateTimestamp);

    const threadData = {
        startBlock: startBlock,
        chain: chain,
        start: date
    }

    const data = JSON.stringify(threadData);

    try{
        fs.writeFileSync(path.resolve(threadLock), data);
    }catch(e){
        console.error(e);
    }

}



function checkLock(): boolean
{
    return fs.existsSync(path.resolve(threadLock));
}


function getLastBlock(chain: string): number|undefined
{
    // read file for get last block
    if( fs.existsSync(path.resolve("src/Files/"+chain+save)) ){
        const lastBlock = fs.readFileSync(path.resolve("src/Files/"+ chain + save));
        const data = JSON.parse(lastBlock);

        return data.lastBlock;
    }

    return undefined
}


function exitProcess(blockNumber: number, chain: string)
{
    // save block and exit process
    console.log('exit process ...');
    blockNumber--;

    if(saveLastBlock(blockNumber, chain)){
        console.log('saved block : '+blockNumber);
    }else{
        console.log('Fail to save block : '+blockNumber);
    }

    const blocksToRescan: string = JSON.stringify(Global.blocksToRescan);

    if(Global.blocksToRescan){
        try{
            fs.writeFileSync(path.resolve("Files/toRescan.json"), blocksToRescan);
            console.log("Rescan saved");
        }catch(e){
            console.error(e);
        }
    }

    process.exit();
}



function saveLastBlock(lastBlock: number, chain: string): boolean
{
    // write file with last block
    const saveBlock = {
        lastBlock: lastBlock
    }

    const data = JSON.stringify(saveBlock);

    try{
        fs.writeFileSync(path.resolve( "src/Files/"+chain + save), data);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }

}



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
    const chainName = opts.chain;
    let chain: Blockchain = getBlockchain(chainName);

    // @ts-ignore
    let blockNumber = opts.block;

    const jetski = new Jetski(chain);
    let api: ApiPromise = await jetski.getApi();

    let currentBlock: number = 0;

    if(blockNumber == 0){
        blockNumber = getLastBlock(chainName);
        if(!blockNumber){
            console.error('Incorrect block number');
            process.exit();
        }
    }

    if(!checkLock()){
        // check if lock file exists

        startJetskiLoop(jetski, api, currentBlock, blockNumber, chainName);

    }else{

        readline.question("Thread is actually locked, did you want to unlock ? (Y/n) ", (answer: string)=>{

            answer = answer.toLowerCase();

            if(answer == "y" || answer == "yes"){

                try{
                    fs.unlinkSync(path.resolve(threadLock));
                }catch(e){
                    console.error(e);
                    console.log("Something is wrong, please delete manually root/thread.lock.json")
                }

                startJetskiLoop(jetski, api, currentBlock, blockNumber, chainName);

            }else{

                process.exit();
            }

        })


    }

}



export function startJetskiLoop(jetski: Jetski, api: ApiPromise, currentBlock: number, blockNumber: number, chain: string)
{
    // generate file for lock one thread
    startLock(blockNumber, chain);

    // launch the loop on blocks
    let interval: NodeJS.Timeout =  setInterval(async()=>{

        process.on('SIGINT', ()=>{
            // Save last block on exit Ctrl+C
            exitProcess(blockNumber, chain);
        });

        process.on('exit', ()=>{
            // Save last block when app is closing
            exitProcess(blockNumber, chain);
        });


        if (!api.isConnected) {

            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');

            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');

            startJetskiLoop(jetski, api, --currentBlock, blockNumber, chain);

        }else{

            if(currentBlock != blockNumber){
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;

                jetski.getBlockContent(blockNumber, api)
                    .then(async remarks=>{
                        // Check if metadata exists
                        const rmrksWithMeta = await metaDataVerifier(remarks);

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

                if(!rmrk.collection?.metaData){
                    Global.blocksToRescan.push(rmrk.transaction.blockId);
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

                if(!rmrk.asset?.metaData){
                    Global.blocksToRescan.push(rmrk.transaction.blockId);
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