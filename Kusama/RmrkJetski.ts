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

        return new Promise ( async (resolve) => {

            const api = await this.getApi();
            const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            const block = await api.rpc.chain.getBlock(blockHash);

            let blockId = blockNumber ;
            let blockTimestamp: string = '0';

            let blockRmrks : Array<Promise<Interaction>> = [];

            for (const ex of block.block.extrinsics){

                const { method: {
                    args, method, section
                }} = ex;

                //note timestamp extrinsic always comes first on a block
                if(section === "timestamp" && method === "set"){
                    blockTimestamp = getTimestamp(ex);
                }

                blockRmrks.push(this.getContent(ex, method, section, blockId, blockTimestamp, args));

            }

            Promise.all(blockRmrks)
                .then(value => {
                    console.log(value);
                    return value;
                }).catch((e)=>{
                // console.log(e);
            });
        })


    }



    private async getContent(ex: any, method: string, section: string, blockId: number, blockTimestamp: string, args: any): Promise<Interaction>{

        return new Promise((resolve, reject)=>{

            if(section === "system" && method === "remark"){

                const remark = args.toString();
                const signer = ex.signer.toString();
                const hash = ex.hash.toHex();

                const tx = new Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);

                if(remark.indexOf("") === 0){

                    this.rmrkToObject(remark, tx)
                        .catch((e)=>{
                            console.error(e);
                        })
                        .then((rmrk)=>{
                            if(rmrk instanceof Interaction){
                                console.log('resolved');
                                resolve (rmrk);
                            }
                        });
                }

            }else if(section === "utility" && method === "batch"){

                const arg = args.toString();
                const batch = JSON.parse(arg);

                let remark: string = "";
                const signer = ex.signer.toString();
                const hash = ex.hash.toHex();

                const tx = new Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);

                for (const rmrkObj of batch){

                    if(rmrkObj.args.hasOwnProperty('_remark')){

                        remark = rmrkObj.args._remark

                        this.rmrkToObject(remark, tx)
                            .catch((e)=>{
                                console.error(e);
                            })
                            .then((rmrk)=>{
                                if(rmrk instanceof Interaction){
                                    resolve (rmrk);
                                }
                            });

                    }
                }
            }else{
                reject ('no rmrk');
            }

        })

    }


    private async rmrkToObject(remark: string, tx: Transaction): Promise<Interaction> {

        return new Promise( async (resolve, reject) => {

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
                reject ('This rmrk is null');
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