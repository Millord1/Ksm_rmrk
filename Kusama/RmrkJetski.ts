import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader.js";
import {Blockchain} from "../classes/Blockchains/Blockchain.js";
import {Transaction} from "../classes/Transaction.js";
import {Entity} from "../classes/Rmrk/Entity.js";
import {Remark} from "../classes/Rmrk/Remark.js";
import {Interaction} from "../classes/Rmrk/Interaction.js";
import {Metadata} from "../classes/Metadata.js";
import {RpcPromiseResult} from "@polkadot/api/types";


export class RmrkJetski
{
    wsProvider: WsProvider;
    // api: any;
    chain: Blockchain;


    constructor(chain: Blockchain){

        this.chain = chain;
        this.wsProvider = new WsProvider(this.chain.wsProvider);
    }

    public async getApi(): Promise<ApiPromise>{

        let myApi: any;

        // if (typeof this.api === 'undefined'){
        //     myApi = await ApiPromise.create({ provider: this.wsProvider });
        // }else{
        //     myApi = this.api;
        // }

        myApi = ApiPromise.create({ provider: this.wsProvider });

        return myApi;
    }




    public async getRmrks(blockNumber: number, api: ApiPromise): Promise<Array<Interaction|string>>{

        return new Promise ( async (resolve, reject) => {

            let blockRmrks : Array<Promise<Interaction|string>> = [];

            let blockHash: any;
            // let block: any;

            try{
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            }catch(e){
                // console.error(e);
                reject('No block')
            }

            // const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            const block = await api.rpc.chain.getBlock(blockHash);

            let blockId = blockNumber ;
            let blockTimestamp: string = '0';

            if(block.block == null){
                reject(null)
            }

            for (const ex of block.block ? block.block.extrinsics : []){

                const { method: {
                    args, method, section
                }} = ex;

                if(section === "timestamp" && method === "set"){
                    blockTimestamp = getTimestamp(ex);
                }

                const timestampToDate = Number(blockTimestamp) * 1000;
                const date = new Date(timestampToDate);

                console.log('block ' + blockNumber + ' ' + date);

                if(section === "system" && method === "remark"){

                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    const tx = new Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);

                    if(remark.indexOf("") === 0){
                        // const buildRemark = await this.rmrkToObject(remark, tx);
                        blockRmrks.push(this.rmrkToObject(remark, tx));
                    }
                }


                if(section === "utility" && method === "batch"){

                    const arg = args.toString();
                    const batch = JSON.parse(arg);

                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    let i = 1;

                    for (const rmrkObj of batch){

                        const txHash = hash + '-' + i;

                        const tx = new Transaction(this.chain, blockId, txHash, blockTimestamp, signer, null);

                        if(rmrkObj.args.hasOwnProperty('_remark')){
                            // const buildRemark = await this.rmrkToObject(rmrkObj.args._remark, tx, i);
                            blockRmrks.push(this.rmrkToObject(rmrkObj.args._remark, tx, i));
                        }
                        i += 1;

                    }

                }

            }

            return Promise.all(blockRmrks)
                .then(value => {
                    resolve (value);
                }).catch((e)=>{
                    console.log(e);
                });

        })

    }



    public async rmrkToObject(remark: string, tx: Transaction, batchIndex?:number): Promise<Interaction|string> {

        return new Promise( async (resolve) => {

            // const isBatch: boolean = batchIndex != undefined;

            const uri = hexToString(remark);
            let lisibleUri = decodeURIComponent(uri);
            lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

            const splitted = lisibleUri.split('::');
            const dataToTreat = splitted[splitted.length - 1].split(',');

            if(splitted.length >= 3){

                const data = Entity.dataTreatment(dataToTreat, Entity.entityObj);

                let meta: Metadata|null;

                if(data.metadata != ""){
                    try{
                        meta = await Metadata.getMetaDataContent(data.metadata, batchIndex)
                            .catch((e)=>{
                                console.log(e);
                                return null;
                            });
                    }catch(e){
                        console.log(e);
                        meta = null;
                    }
                }else{
                    meta = null;
                }

                const reader = new RmrkReader(this.chain, tx);
                const rmrk = reader.readInteraction(lisibleUri, meta);

                if(rmrk instanceof Interaction){
                    resolve (rmrk);
                }else{
                    resolve ('no rmrk');
                }
            }else{
                resolve ('no rmrk');
            }

        })
    }


}

function getTimestamp(ex:any): string  {

    let argString = ex.args.toString();
    let secondTimestamp = Number(argString)/1000
    
    return secondTimestamp.toString();
}





// 4960570


// const scan = new RmrkJetski(new Kusama());

// FAIL
// scan.getRmrks(5445790);

// Human Json (file)
// scan.getRmrks(5445790);

//Send
// scan.getRmrks(5437975)


// MintNft
// scan.getRmrks(5420541);

// Mint
// scan.getRmrks(5083411);

// scan.getRmrks(2176215);