import {Blockchain} from "../Blockchains/Blockchain";
import {ApiPromise, WsProvider} from '@polkadot/api';
import {Interaction} from "../Remark/Interactions/Interaction";
import {Transaction} from "../Remark/Transaction";
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader";
import {MetaData} from "../Remark/MetaData";
import {Mint} from "../Remark/Interactions/Mint";
import {Entity} from "../Remark/Entities/Entity";
import {MintNft} from "../Remark/Interactions/MintNft";


interface Transfer
{
    destination: string,
    value: string
}

interface metadataCalls
{
    url: string,
    meta: MetaData|undefined
}

export const metaCalled: Array<metadataCalls> = [];

export let batchLength: number;

export class Jetski
{

    public static noBlock: string = "No Block";

    public chain: Blockchain;
    private readonly wsProvider: WsProvider;

    public static maxPerBatch: number = 99;

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

        return new Promise(async (resolve, reject)=>{

            let blockRmrk: Array<Promise<Interaction|string>> = [];
            let blockHash: any;

            try{
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            }catch(e){
                // console.log(e);
                reject(Jetski.noBlock);
            }

            // Get block from APi
            const block = await api.rpc.chain.getBlock(blockHash);

            let blockId = blockNumber;
            let blockTimestamp: string = "";

            if(block.block == null){
                reject(Jetski.noBlock);
            }

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
                console.log('block ' + blockNumber + ' ' + date);


                if(section === "system" && method === "remark"){
                    // If block have simple remark

                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    // Create transaction with block's info
                    const tx = new Transaction(blockId, hash, blockTimestamp, this.chain, signer);

                    if(remark.indexOf("") === 0){
                        // Create object from rmrk
                        blockRmrk.push(this.getObjectFromRemark(remark, tx));
                    }
                }

                if(section === "utility" && method.includes("batch")){
                    // If rmrks are in batch

                    const arg = args.toString();
                    const batch = JSON.parse(arg);

                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    // Transfer object for complement Buy data (payment address and value)
                    const transfer: Transfer|undefined = Jetski.checkIfTransfer(batch);

                    let i = 1;

                    // if batch bigger than 200 rmrks
                    if(batch.length >= Jetski.maxPerBatch){

                        blockRmrk = await this.eggExplorer(batch, signer, hash, blockId, blockTimestamp, 0)

                    }else{

                        for (const rmrkObj of batch){
                            // Increment tx Hash
                            const txHash = hash + '-' + i;

                            const destination = transfer ? transfer.destination : undefined;
                            const value = transfer ? transfer.value : undefined;

                            const tx = new Transaction(blockId, txHash, blockTimestamp, this.chain, signer, destination, value);

                            if(rmrkObj.args.hasOwnProperty('_remark')){
                                // If batch have rmrk
                                blockRmrk.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
                            }
                            i += 1;
                        }

                    }
                }

            }

            return Promise.all(blockRmrk)
                .then(async result=>{
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

            if(isRemark){
                if(args.hasOwnProperty('dest') && args.hasOwnProperty('value')){
                    transfert.destination = args.dest.Id;
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

            let rmrkWithMeta: Array<Promise<Interaction>|Interaction> = [];
            let i: number = 0;

            let myRmrk: Interaction|undefined = undefined;

            for(const rmrk of interactions){

                if(rmrk instanceof Mint || rmrk instanceof MintNft){

                    let entity: Entity|undefined = rmrk instanceof Mint ? rmrk.collection : rmrk.asset;
                    const metaUrl = entity?.url.split("/").pop();

                    if(metaUrl){
                        // check if url has already been called
                        if(!metaCalled.some(meta => meta.url == metaUrl)){
                            // if not called, call it
                            myRmrk = await this.callMeta(rmrk, i);
                            metaCalled.push({
                                url: metaUrl,
                                meta: entity?.metaData
                            });
                            rmrkWithMeta.push(myRmrk);

                        }

                        const meta = metaCalled.find(meta => meta.url == metaUrl);

                        if(myRmrk){
                            // if metaData already called on first loop
                            if(meta && meta.meta){
                                entity?.addMetadata(meta.meta);
                                rmrkWithMeta.push(rmrk);
                            }else{
                                rmrkWithMeta.push(this.callMeta(rmrk, i));
                            }

                        }else if(meta){
                            // if meta exists on second or more loops
                            if(meta.meta){
                                entity?.addMetadata(meta.meta);
                                rmrkWithMeta.push(rmrk);
                            }
                        }else{
                            rmrkWithMeta.push(this.callMeta(rmrk, i));
                        }
                    }

                }else if (rmrk instanceof Interaction){
                    // only Mint and MintNft have meta
                    rmrkWithMeta.push(rmrk);
                }
                i++;
            }

            if(rmrkWithMeta.length >= Jetski.maxPerBatch || rmrkWithMeta.length >= interactions.length){

                return Promise.all(rmrkWithMeta)
                    .then((remarks)=>{
                        resolve (remarks);
                    }).catch(e=>{
                        // console.error(e);
                        reject(e);
                    })
            }

        })

    }



    private async callMeta(remark: Interaction, index?: number): Promise<Interaction>
    {

        let entity: Entity|undefined;

        if(remark instanceof Mint){

            if(remark.collection){
                entity = remark.collection;
            }

        }else if(remark instanceof MintNft){

            if(remark.asset){
                entity = remark.asset;
            }
        }

        return new Promise((resolve, reject)=>{

            if(entity){

                const metaAlreadyCalled = metaCalled.find(meta => meta.url === entity?.url);

                // if call on this url already been made (stock in attribute metaCalled)
                if(metaAlreadyCalled && metaAlreadyCalled.meta){
                    entity.addMetadata(metaAlreadyCalled.meta);
                }else{
                    MetaData.getMetaData(entity.url, index).then(meta=>{
                        entity?.addMetadata(meta);
                        resolve(remark);
                    }).catch((e)=>{
                        // console.error(e);
                        resolve(remark);
                    })
                }

            }else{
                reject(Entity.undefinedEntity);
            }

        })

    }



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
            }

            const reader = new RmrkReader(this.chain, transaction);
            const rmrk = reader.readInteraction(url);

            if(rmrk instanceof Interaction){
                resolve (rmrk);
            }else{
                resolve ('no rmrk');
            }

        })

    }



    private static getTimestamp(ex:any): string  {

        let argString = ex.args.toString();
        let secondTimestamp = Number(argString)/1000

        return secondTimestamp.toString();
    }



    private pushRemarks(batch: any, hash: string, blockId: number, timestamp: string, signer: string, remarks: Array<Promise<Interaction|string>> = []): Array<Promise<Interaction|string>>
    {
        const transfer: Transfer|undefined = Jetski.checkIfTransfer(batch);

        let i = 1;

        for (const rmrkObj of batch){
            // Increment tx Hash
            const txHash = hash + '-' + i;

            const destination = transfer ? transfer.destination : undefined;
            const value = transfer ? transfer.value : undefined;

            const tx = new Transaction(blockId, txHash, timestamp, this.chain, signer, destination, value);

            if(rmrkObj.args.hasOwnProperty('_remark')){
                // If batch have rmrk
                remarks.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
            }
            i += 1;
        }

        return remarks;
    }



    private async eggExplorer(
        batch: any,
        signer: string,
        hash: string,
        blockId: number,
        timestamp: string,
        count: number,
        remarks: Array<Promise<Interaction|string>> = []
    ): Promise<Array<Promise<Interaction | string>>>
    {
        // create remarks from big batch (>500)
        return new Promise(async (resolve, reject)=>{

            const batchLength = batch.length;

            let start: number;

            // start is count for starting slice
            if(count == 0){
                start = count;
            }else{
                start = count * 500;
            }

            console.log("start : "+start);

            // 500 remarks by loop
            let stop = start + 500;

            // where stop slice
            stop = stop > batchLength ? batchLength : stop;

            console.log("stop : "+stop);

            batch = batch.slice(start, stop);

            // remarks = await this.pushRemarks(batch, hash, blockId, timestamp, signer, remarks);

            // Transfer object for complement Buy data (payment address and value)
            const transfer: Transfer|undefined = Jetski.checkIfTransfer(batch);

            let i = 1;

            for (const rmrkObj of batch){
                // Increment tx Hash
                const txHash = hash + '-' + i;

                const destination = transfer ? transfer.destination : undefined;
                const value = transfer ? transfer.value : undefined;

                const tx = new Transaction(blockId, txHash, timestamp, this.chain, signer, destination, value);

                if(rmrkObj.args.hasOwnProperty('_remark')){
                    // If batch have rmrk
                    remarks.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
                }
                i += 1;
            }

            // if batch still have remarks to process
            if(stop != batchLength){
                this.eggExplorer(batch, signer, hash, blockId, timestamp, ++count, remarks);
            }else{
                resolve (remarks);
            }

        })

    }


    // Manual process of big batch (called from yarn)
    public async getBigBlock(blockNumber: number, api: ApiPromise, count: number): Promise<Array<Interaction>>
    {

        return new Promise(async (resolve, reject)=>{

            let blockRmrk: Array<Promise<Interaction|string>> = [];
            let blockHash: any;

            try{
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            }catch(e){
                // console.log(e);
                reject(Jetski.noBlock);
            }

            // Get block from API
            const block = await api.rpc.chain.getBlock(blockHash);

            let blockId = blockNumber;
            let blockTimestamp: string = "";

            if(block.block == null){
                reject(Jetski.noBlock);
            }

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
                console.log('block ' + blockNumber + ' ' + date);


                if(section === "utility" && method.includes("batch")){
                    // If rmrks are in batch

                    const arg = args.toString();
                    let batch = JSON.parse(arg);

                    if(!batch){
                        setTimeout(()=>{
                            console.log("no more batch");
                            // process.exit();
                        },5000);
                    }

                    const totalLength = batch.length;
                    batchLength = totalLength;

                    let start: number;

                    if(count == 0){
                        start = count;
                    }else{
                        start = count * Jetski.maxPerBatch;
                    }

                    console.log("start : "+start);

                    let stop = start + Jetski.maxPerBatch;

                    if(start > totalLength){
                        console.log("This block is finished");
                        process.exit();
                    }

                    if(stop > totalLength){
                        stop = totalLength;

                        console.log("block length achieved");
                        // setTimeout(()=>{
                        //     console.log("LAST");
                        // }, 1000);
                    }

                    batch = batch.slice(start, stop);

                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    // Transfer object for complement Buy data (payment address and value)
                    const transfer: Transfer|undefined = Jetski.checkIfTransfer(batch);

                    let i = 1;

                    for (const rmrkObj of batch){
                        // Increment tx Hash
                        const txHash = hash + '-' + i;

                        const destination = transfer ? transfer.destination : undefined;
                        const value = transfer ? transfer.value : undefined;

                        const tx = new Transaction(blockId, txHash, blockTimestamp, this.chain, signer, destination, value);

                        if(rmrkObj.args.hasOwnProperty('_remark')){
                            // If batch have rmrk
                            blockRmrk.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
                        }
                        i += 1;
                    }

                }

            }

            return Promise.all(blockRmrk)
                .then(async result=>{
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
                })

        })

    }



}