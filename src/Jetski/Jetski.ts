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


export class Jetski
{

    public static noBlock: string = "No Block";

    public chain: Blockchain;
    private readonly wsProvider: WsProvider;


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


                if(section === "utility" && method === "batch"){
                    // If rmrks are in batch

                    const arg = args.toString();
                    const batch = JSON.parse(arg);

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
                            blockRmrk.push(this.getObjectFromRemark(rmrkObj.args._remark, tx, i));
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
                    console.error(e);
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

            for(const rmrk of interactions){

                if(rmrk instanceof Mint || rmrk instanceof  MintNft){
                    rmrkWithMeta.push(this.callMeta(rmrk, i));
                }else if (rmrk instanceof Interaction){
                    rmrkWithMeta.push(rmrk);
                }
                i++;
            }

            return Promise.all(rmrkWithMeta)
                .then((remarks)=>{
                    resolve (remarks);
                }).catch(e=>{
                    // console.error(e);
                    reject(e);
                })

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
                MetaData.getMetaData(entity.url, index).then(meta=>{
                    entity?.addMetadata(meta);
                    resolve(remark);
                }).catch((e)=>{
                    // console.error(e);
                    resolve(remark);
                })
            }else{
                reject(Entity.undefinedEntity);
            }

        })

    }



    public getObjectFromRemark(remark: string, transaction: Transaction, batchIndex?: number): Promise<Interaction|string>
    {
        // Promise create an object with rmrk
        return new Promise((resolve)=>{

            const uri = hexToString(remark);
            const url = decodeURIComponent(uri);

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


}