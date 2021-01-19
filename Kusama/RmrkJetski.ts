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



    public async getRmrks(blockNumber: number): Promise<Array<Remark>>{


        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        const blockRmrks : Array<Remark> = [];

        // const signedBlock = await api.rpc.chain.getBlock();
        // const blockDatas = await api.query.system.events.at(signedBlock.block.header.hash);
        //
        // //@ts-ignore
        // signedBlock.block.extrinsics.forEach(({ method: {method, section} }, index) => {
        //     //@ts-ignore
        //     const events = blockDatas.filter(({ phase }) =>
        //     phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index))
        //         //@ts-ignore
        //         .map(({ event }) => `${event.section}.${event.method}`);
        //
        //     console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
        // })



        block.block.extrinsics.forEach((ex: any) => {
            // console.log("showing method")
            // console.log(ex);
            console.log(ex.hash.toHex())
            const { method: {
                args, method, section
            }} = ex;

            // console.log(ex.events);

            if(section === "system" && method === "remark"){

               // console.log(ex)
                const remark = args.toString();
                const signer = ex.signer.toString();

                // const signature = ex.signature.toString();

                // findHash(api, signer);

                if(remark.indexOf("") === 0){

                    // const uri = hexToString('0x7b2276657273696f6e223a22524d524b302e31222c226e616d65223a22446f74204c656170204561726c792050726f6d6f74657273222c226d6178223a203130302c22697373756572223a2243706a734c4443314a467972686d3366744339477334516f79726b484b685a4b744b37597147545246745461666770222c2273796d626f6c223a22444c4550222c226964223a22306166663638363562656433613636622d444c4550222c226d65746164617461223a22697066733a2f2f697066732f516d5667733850346177685a704658686b6b676e437742703441644b526a3346394b35386d435a366678766e336a227d');

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