import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader";
import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Remark} from "../classes/Rmrk/Remark";


export class ScanBlock
{
    wsProvider;
    api;
    chain: Blockchain;


    constructor(chain: Blockchain){

        this.chain = chain;
        this.wsProvider = new WsProvider(this.chain.wsProvider);
    }

    private async getApi(){

        let myApi;

        if (typeof this.api === 'undefined'){
            myApi = await ApiPromise.create({ provider: this.wsProvider });
        }else{
            myApi = this.api;
        }

        return myApi;
    }


    // @ts-ignore
    public async getRmrks(blockNumber: number): Promise < Array<Remark> >{


        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        const blockRmrks = [];

        block.block.extrinsics.forEach((ex) => {

            const { method: {
                args, method, section
            }} = ex;

            if(section === "system" && method === "remark"){

                const remark = args.toString();
                const signer = ex.signer.toString();

                if(remark.indexOf("") === 0){

                    // const txId = ex.transactionHash;

                    console.log(ex.transactionHash);

                    const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const reader = new RmrkReader(this.chain, signer);
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    // console.log(rmrkReader);

                    blockRmrks.push(rmrkReader);
                }
            }

        })

        // console.log(blockRmrks);

        return blockRmrks;
    }


}

// const scan = new ScanBlock(new Kusama());

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