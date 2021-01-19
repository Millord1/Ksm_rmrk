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
        let blockId = blockNumber ;

        let blockTimestamp =  0 ;


        const blockRmrks : Array<Remark> = [];

        block.block.extrinsics.forEach((ex: any) => {
           // console.log("showing method")
           // console.log(ex.toHuman());
           // console.log(ex.hash.toHex());

            const { method: {
                args, method, section
            }} = ex;

            //note timestamp extrinsic always comes first on a block
            if(section === "timestamp" && method === "set"){
               blockTimestamp = getTimestamp(ex);
            }


            if(section === "system" && method === "remark"){

              //  console.log(ex)
                const remark = args.toString();
                const signer = ex.signer.toString();

                //TODO push timestamp into your object @Millord
                const hash = ex.hash.toHex();

                //TODO push timestamp into your object @Millord
                blockTimestamp = blockTimestamp ;

                //TODO push timestamp into your object @Millord
                blockId = blockId ;

                // const signature = ex.signature.toString();

                // findHash(api, signer);

                if(remark.indexOf("") === 0){

                    const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');
                    console.log(lisibleUri);
                    const reader = new RmrkReader(this.chain, signer);
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    blockRmrks.push(rmrkReader);
                }
            }

        })

        return blockRmrks;
    }


}

function getTimestamp(ex:any)  {

    let argString = ex.args.toString();
    let secondTimestamp = Number(argString)/1000

    return secondTimestamp ;

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