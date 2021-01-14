import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader.js";
import {Blockchain} from "../classes/Blockchains/Blockchain.js";
import {Remark} from "../classes/Rmrk/Remark.js";

export class RmrkJetski
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


    // @ts-ignore
    public async getRmrks(blockNumber: number): Promise<Array<Remark>>{


        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        const blockRmrks : Array<Remark> = [];

        block.block.extrinsics.forEach((ex: any) => {

            const { method: {
                args, method, section
            }} = ex;

            if(section === "system" && method === "remark"){

                const remark = args.toString();
                const signer = ex.signer.toString();

                // findHash(api, signer);

                if(remark.indexOf("") === 0){

                    const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const reader = new RmrkReader(this.chain, signer);
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    blockRmrks.push(rmrkReader);
                }
            }

        })
        return blockRmrks;
    }


}


const findHash = async (api: ApiPromise, signer: string) => {

    const test = await api.tx.system.remark(signer);
    console.log(test);


}

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