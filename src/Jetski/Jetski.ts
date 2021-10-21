import {Blockchain} from "../Blockchains/Blockchain";
import {ApiPromise, WsProvider} from '@polkadot/api';
import {Interaction} from "../Remark/Interactions/Interaction";
import {Transaction} from "../Remark/Transaction";
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader";
import {MetaData, MetadataInputs} from "../Remark/MetaData";
import {Mint} from "../Remark/Interactions/Mint";
import {Entity} from "../Remark/Entities/Entity";
import {MintNft} from "../Remark/Interactions/MintNft";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {ChangeIssuer} from "../Remark/Interactions/ChangeIssuer";
import {RmrkBlockchain} from "../Blockchains/RmrkBlockchain";


interface Transfer
{
    destination: string,
    value: string
}

export interface MetadataCalls
{
    url: string,
    meta: MetaData
}

export let metaCalled: Array<MetadataCalls> = [];
export let entityFound: Array<Entity> = [];

export class Jetski
{

    public static noBlock: string = "No Block";

    public chain: Blockchain;
    private readonly wsProvider: WsProvider;

    public static maxPerBatch: number = 100;
    public static minForEggs: number = 10;

    constructor(chain: Blockchain) {
        this.chain = chain;
        this.wsProvider = new WsProvider(this.chain.wsProvider);
    }



    public async getApi(): Promise<ApiPromise>
    {
        let api: ApiPromise;
        api = await ApiPromise.create({provider: this.wsProvider});
        return api;
    }



    public async getBlockContent(blockNumber: number, api: ApiPromise): Promise<Array<Interaction>>
    {
        // Clear meta storage at each block
        metaCalled = [];
        entityFound = [];


        return new Promise(async (resolve, reject)=>{

            // let blockRmrk: Array<Promise<Interaction|string>> = [];
            let blockHash: any;
            let block: any;

            try{
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
                // if (blockHash == "0x0000000000000000000000000000000000000000000000000000000000000000") {
                if (blockHash.includes(CSCanonizeManager.mintIssuerAddressString)) {
                    reject(Jetski.noBlock);
                    return;
                }
            }catch(e){
                reject(Jetski.noBlock);
                return;
            }

            // Get block from APi
            try{
                block = await api.rpc.chain.getBlock(blockHash);
            }catch(e){
                reject(Jetski.noBlock);
                return;
            }

            let blockId = blockNumber;
            let blockTimestamp: string = "";

            if(block.block == null){
                reject(Jetski.noBlock);
                return;
            }

            // blockRmrk = await this.chain.getBlockData(block, blockId, blockTimestamp, this.chain, blockRmrk, this);

            // for (const ex of block.block ? block.block.extrinsics : []){
            //
            //     const { method: {
            //         args, method, section
            //     } } = ex;
            //
            //     if(section === "timestamp" && method === "set"){
            //         blockTimestamp = Jetski.getTimestamp(ex);
            //     }
            //
            //     const dateTimestamp = Number(blockTimestamp) * 1000;
            //     const date = new Date(dateTimestamp);
            //     // Display block date and number
            //     console.log('block ' + blockNumber + ' ' + date);
            //
            //     if(section === "system" && method === "remark"){
            //         // If block have simple remark
            //
            //         const remark = args.toString();
            //         const signer = ex.signer.toString();
            //         const hash = ex.hash.toHex();
            //
            //         // Create transaction with block's info
            //         const tx = new Transaction(blockId, hash, blockTimestamp, this.chain, signer);
            //
            //         if(remark.indexOf("") === 0){
            //             // Create object from rmrk
            //
            //             blockRmrk.push(this.getObjectFromRemark(remark, tx));
            //
            //         }
            //     }
            //
            //     if(section === "utility" && method.includes("batch")){
            //         // If rmrks are in batch
            //
            //         const arg = args.toString();
            //         const batch = JSON.parse(arg);
            //
            //         const signer = ex.signer.toString();
            //         const hash = ex.hash.toHex();
            //
            //         let i = 1;
            //
            //         // if batch bigger than 200 rmrks
            //         if(batch.length >= Jetski.minForEggs){
            //             blockRmrk = await this.eggExplorer(batch, signer, hash, blockId, blockTimestamp, 0);
            //         }else{
            //             blockRmrk = await this.pushRemarks(batch, hash, blockId, blockTimestamp, signer, i, blockRmrk);
            //         }
            //     }
            // }
            //
            // return Promise.all(blockRmrk)
            //     .then(async result=>{
            //
            //         const isOnlyStrings = (element: string|Interaction) => typeof element == "string";
            //
            //         if(result.every(isOnlyStrings)){
            //             reject ("no rmrk");
            //         }
            //
            //         let interactions;
            //
            //         try{
            //             interactions = await this.getMetadataContent(result);
            //             resolve (interactions);
            //         }catch(e){
            //             // retry if doesn't work
            //             try{
            //                 interactions = await this.getMetadataContent(result);
            //                 resolve (interactions);
            //             }catch(e){
            //                 console.error(e);
            //                 reject (e);
            //             }
            //         }
            //
            //     })
            //     .catch(e=>{
            //         reject(e);
            //     })

            this.chain.getBlockData(block, blockId, blockTimestamp, this.chain, this)
                .then(async result=>{

                    const isOnlyStrings = (element: string|Interaction) => typeof element == "string";

                    if(result.every(isOnlyStrings)){
                        reject ("no rmrk");
                        return;
                    }

                    let interactions;

                    try{
                        interactions = await this.getMetadataContent(result);
                        resolve (interactions);
                    }catch(e){
                        // retry if doesn't work
                        try{
                            interactions = await this.getMetadataContent(result);
                            resolve (interactions);
                        }catch(e){
                            console.error(e);
                            reject (e);
                        }
                    }

                })
                .catch(e=>{
                    reject(e);
                    return;
                })

        })

    }




    private static checkIfTransfer(batch: any): Transfer|undefined
    {
        // Check if batch have rmrk and transfer for Buy

        let isRemark: boolean = false;
        let isTransfert: boolean = false;

        const transfert: Transfer = {
            destination : "",
            value: ""
        };

        for(let i = 0; i<batch.length; i++){

            const args = batch[i].args;

            if(args.hasOwnProperty('_remark')){
                isRemark = true;
            }

            if(isRemark && !isTransfert){
                if(args.hasOwnProperty('dest') && args.hasOwnProperty('value')){
                    transfert.destination = args.dest.id;
                    transfert.value = args.value;
                    isTransfert = true;
                }
            }
        }

        return isTransfert ? transfert : undefined;
    }



    public async getMetadataContent(interactions: Array<Interaction|string>): Promise<Array<Interaction>>
    {
        // Resolve all promises with metadata
        return new Promise(async (resolve, reject)=>{

            let interactArray: Array<Interaction> = [];
            let toCall: Array<Mint|MintNft> = [];

            for(const rmrk of interactions){

                if(rmrk instanceof Mint || rmrk instanceof MintNft){
                    toCall.push(rmrk);

                }else if (rmrk instanceof Interaction){
                    interactArray.push(rmrk);
                }
            }

            const rmrkWithMeta: Array<Interaction> = await MetaData.getMetaOnArray(toCall);
            const allRemarks: Array<Interaction> = interactArray.concat(rmrkWithMeta);

            resolve(allRemarks);
        })

    }



    // private async callMeta(remark: Interaction, index?: number): Promise<Interaction>
    // {
    //
    //     let entity: Entity|undefined;
    //
    //     if(remark instanceof Mint){
    //
    //         if(remark.collection){
    //             entity = remark.collection;
    //         }
    //
    //     }else if(remark instanceof MintNft){
    //
    //         if(remark.asset){
    //             entity = remark.asset;
    //         }
    //     }
    //
    //     return new Promise((resolve, reject)=>{
    //
    //         if(entity){
    //
    //             const metaAlreadyCalled = metaCalled.find(meta => meta.url === entity?.url);
    //
    //             // if call on this url already been made (stocked in array metaCalled)
    //             if(metaAlreadyCalled && metaAlreadyCalled.meta){
    //                 entity.addMetadata(metaAlreadyCalled.meta);
    //             }else{
    //                 MetaData.getMetaData(entity.url, index).then(meta=>{
    //                     entity?.addMetadata(meta);
    //                     resolve(remark);0
    //                 }).catch((e)=>{
    //                     // console.error(e);
    //                     resolve(remark);
    //                 })
    //             }
    //
    //         }else{
    //             reject(Entity.undefinedEntity);
    //         }
    //
    //     })
    //
    // }



    public getObjectFromRemark(remark: string, transaction: Transaction): Promise<Interaction|string>
    {
        // Promise create an object with rmrk
        return new Promise((resolve, reject)=>{

            const uri = hexToString(remark);
            let url: string= "";

            try{
                url = decodeURIComponent(uri)
            }catch(e){
                reject(e);
                return;
            }

            const reader = new RmrkReader(this.chain, transaction);
            const rmrk = reader.readInteraction(url);

            if(!(rmrk instanceof ChangeIssuer)){
                if(!(rmrk?.getEntity())){
                    resolve("no rmrk");
                }
            }

            if(rmrk instanceof Interaction){
                resolve (rmrk);
            }else{
                resolve ('no rmrk');
            }

        })

    }



    public static getTimestamp(ex:any): string  {

        let argString = ex.args.toString();
        let secondTimestamp = Number(argString)/1000

        return secondTimestamp.toString();
    }



    public async pushRemarks(batch: any, hash: string, blockId: number, timestamp: string, signer: string, start: number, remarks: Array<Promise<Interaction|string>> = []): Promise<Array<Promise<Interaction | string>>>
    {
        const transfer: Transfer|undefined = Jetski.checkIfTransfer(batch);

        let i = start;

        for (const rmrkObj of batch){
            // Increment tx Hash
            const txHash = hash + '-' + i;

            const destination = transfer ? transfer.destination : undefined;
            const value = transfer ? transfer.value : undefined;

            const tx = new Transaction(blockId, txHash, timestamp, this.chain, signer, destination, value);

            const properties = Object.getOwnPropertyNames(rmrkObj.args);

            properties.forEach((prop)=>{
                if(prop.includes("remark")){
                    remarks.push(this.getObjectFromRemark(rmrkObj.args[prop], tx));
                }
            })

            i += 1;
        }

        return remarks;
    }



    public async eggExplorer(
        batch: any,
        signer: string,
        hash: string,
        blockId: number,
        timestamp: string,
        count: number,
        remarks: Array<Promise<Interaction|string>> = []
    ): Promise<Array<Promise<Interaction|string>>>
    {
        // create remarks from big batch
        return new Promise(async (resolve)=>{

            const totalLength = batch.length;

            let start: number;

            if(count == 0){
                start = count;
            }else{
                start = count * Jetski.maxPerBatch;
            }

            let stop = start + Jetski.maxPerBatch;

            if(start > totalLength){
                console.log("This block is finished");
                resolve (remarks)
            }

            if(stop > totalLength){
                stop = totalLength;
            }

            const myBatch: Array<any> = [];

            for(let i = start; i < stop; i++){
                if(batch[i]){
                    myBatch.push(batch[i]);
                }
            }

            if(myBatch.length == 0){
                resolve (remarks);
            }

            if(this.chain instanceof RmrkBlockchain){
                remarks = await this.pushRemarks(myBatch, hash, blockId, timestamp, signer, start, remarks);
            }else{
                // TODO for classic chain
                // remarks = await
            }
            // if batch still have remarks to process
            if(stop != totalLength){
                await this.eggExplorer(batch, signer, hash, blockId, timestamp, ++count, remarks);
            }

            resolve (remarks);
        })

    }


}