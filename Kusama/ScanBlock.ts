import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {Kusama} from "../classes/Blockchains/Kusama";
import {Rmrk} from "../classes/Rmrk";
import {Collection} from "../classes/Collection";
import {RmrkReader} from "./RmrkReader";


class ScanBlock
{
    wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
    api;

    private async getApi(){

        let myApi;

        if (typeof this.api === 'undefined'){
            myApi = await ApiPromise.create({ provider: this.wsProvider });
        }else{
            myApi = this.api;
        }

        return myApi;
    }


    public async getRmrks(blockNumber: number){

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

                if(remark.indexOf("") === 0){

                    const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    console.log(remark);
                    // lisibleUri = lisibleUri.substring(12);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const reader = new RmrkReader(new Kusama());
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    blockRmrks.push({
                        block : blockNumber,
                        rmrk : lisibleUri,
                        // type : myRmrk.constructor.name,
                        // content : myRmrk
                    });
                }
            }

        })
        console.log(blockRmrks);
        return blockRmrks;
    }




}

const scan = new ScanBlock();


// FAIL
// scan.getRmrks(5445790);

// Human Json (file)
// scan.getRmrks(5445689);

// Machine Json (hex)
scan.getRmrks(5456387);