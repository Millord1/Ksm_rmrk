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


    public async getRmrks(blockNumber: number, api: ApiPromise): Promise<Array<Remark|string>>{

        return new Promise ( async (resolve) => {

            // const api = await this.getApi();
            const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            const block = await api.rpc.chain.getBlock(blockHash);

            let blockId = blockNumber ;
            let blockTimestamp: string = '0';

            let blockRmrks : Array<Promise<Interaction|string>> = [];

            for (const ex of block.block.extrinsics){

                const { method: {
                    args, method, section
                }} = ex;

                //note timestamp extrinsic always comes first on a block
                if(section === "timestamp" && method === "set"){
                    blockTimestamp = getTimestamp(ex);
                }

                const timestampToDate = Number(blockTimestamp) * 1000;
                const date = new Date(timestampToDate);

                const day: number = date.getDay();
                let month: number = date.getMonth() + 1;
                const year: number = date.getFullYear();

                const humanDate = month+'/'+day+'/'+year;

                console.log('block ' + blockNumber + ' date : ' + humanDate);

                if(section === "system" && method === "remark"){

                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    const tx = new Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);

                    if(remark.indexOf("") === 0){
                        blockRmrks.push(this.rmrkToObject(remark, tx));
                    }
                }


                if(section === "utility" && method === "batch"){

                    const arg = args.toString();
                    const batch = JSON.parse(arg);

                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();

                    const tx = new Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);

                    for (const rmrkObj of batch){

                        if(rmrkObj.args.hasOwnProperty('_remark')){
                            blockRmrks.push(this.rmrkToObject(rmrkObj.args._remark, tx));
                        }

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



    private async rmrkToObject(remark: string, tx: Transaction): Promise<Interaction|string> {

        return new Promise( async (resolve) => {

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
            const rmrk = reader.readInteraction(lisibleUri, meta);

            if(rmrk instanceof Interaction){
                resolve (rmrk);
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