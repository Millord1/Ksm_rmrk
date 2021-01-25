import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader.js";
import {Blockchain} from "../classes/Blockchains/Blockchain.js";
import {Transaction} from "../classes/Transaction.js";
import {Send} from "../classes/Rmrk/Interactions/Send.js";
import {Entity} from "../classes/Rmrk/Entity.js";
import {Metadata} from "../classes/Metadata.js";
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


    public async getRmrks(blockNumber: number): Promise<Array<Remark>>{


        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        let blockId = blockNumber ;
        let blockTimestamp: string ;


        const blockRmrks : Array<Remark> = [];

        block.block.extrinsics.forEach((ex: any) => {


            const { method: {
                args, method, section
            }} = ex;

            //note timestamp extrinsic always comes first on a block
            if(section === "timestamp" && method === "set"){
               blockTimestamp = getTimestamp(ex);
            }


            if(section === "system" && method === "remark"){

                const remark = args.toString();
                const signer = ex.signer.toString();
                const hash = ex.hash.toHex();


                const tx = new Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);

                if(remark.indexOf("") === 0){

                    const uri = hexToString(remark);
                    // const hexa = '0x7b22636f6c6c656374696f6e223a22306166663638363562656433613636622d444c4550222c226e616d65223a224561726c792050726f6d6f746572732076657273696f6e203135222c22696e7374616e6365223a22444c3135222c227472616e7366657261626c65223a312c22736e223a2230303030303030303030303030303031222c226d65746164617461223a22697066733a2f2f697066732f516d61766f54566256486e4745557a746e425432703372696633714250654366797955453576345a376f46767334227d';
                    // const uri = hexToString(hexa);
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');


                    const reader = new RmrkReader(this.chain, tx);
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    blockRmrks.push(rmrkReader);
                }
            }

        })
        return blockRmrks;
    }


}

function getTimestamp(ex:any): string  {

    let argString = ex.args.toString();
    let secondTimestamp = Number(argString)/1000
    
    return secondTimestamp.toString();
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