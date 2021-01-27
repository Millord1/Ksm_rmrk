import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {RmrkReader} from "./RmrkReader.js";
import {Blockchain} from "../classes/Blockchains/Blockchain.js";
import {Transaction} from "../classes/Transaction.js";
import {Entity} from "../classes/Rmrk/Entity.js";
import {Remark} from "../classes/Rmrk/Remark.js";
import {Interaction} from "../classes/Rmrk/Interaction.js";
import {Metadata} from "../classes/Metadata.js";

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
        let blockTimestamp: string = '0';

        const blockRmrks : Array<Remark> = [];

        for (const ex of block.block.extrinsics){

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
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const splitted = lisibleUri.split('::');

                    const data = Entity.dataTreatment(splitted, Entity.entityObj);

                    let meta: Metadata|null;

                    if(data.metadata !== ""){
                        meta = await Entity.getMetaDataContent(data.metadata);
                    }else{
                        meta = null;
                    }

                    const reader = new RmrkReader(this.chain, tx);
                    const rmrkReader = reader.readInteraction(lisibleUri, meta);

                    if(rmrkReader instanceof Interaction){
                        blockRmrks.push(rmrkReader);
                    }
                }
            }
        }

        return blockRmrks;
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