import {ApiPromise, WsProvider} from "@polkadot/api";
import {Blockchain} from "./classes/Blockchains/Blockchain.js";

const fs = require('fs');
const path = require('path');

export class BatchReader
{
    wsProvider: WsProvider;
    api: any;
    chain: Blockchain;


    constructor(chain: Blockchain){

        this.chain = chain;
        this.wsProvider = new WsProvider(this.chain.wsProvider);
    }

    private async getApi(){

        let myApi: any;

        if (typeof this.api === 'undefined'){
            myApi = await ApiPromise.create({ provider: this.wsProvider });
        }else{
            myApi = this.api;
        }

        return myApi;
    }


    public async getBatchBlocks(blockNumber: number): Promise<Array<number>>{

        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

        const block = await api.rpc.chain.getBlock(blockHash);

        let blockId = blockNumber ;

        let blockArray : Array<number> = [];

        for (const ex of block.block.extrinsics){

            const { method: {
                args, method, section
            }} = ex;

            if(section === "utility" && method === "batch"){

                const arg = args.toString();
                const batch = JSON.parse(arg);

                for (const rmrkObj of batch){

                    if(rmrkObj.args.hasOwnProperty('_remark')){

                        blockArray.push(blockId);
                    }
                }
            }
        }

        return blockArray;
    }

}