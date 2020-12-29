import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {Kusama} from "../classes/Blockchains/Kusama";
import {RmrkReader} from "./RmrkReader";
import {Blockchain} from "../classes/Blockchains/Blockchain";


class ScanBlock
{
    wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
    api;
    chain: Blockchain;

    constructor(chain: Blockchain){
        this.chain = chain;
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


    public async getRmrks(blockNumber: number){

        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        const blockRmrks = [];

        block.block.extrinsics.forEach((ex) => {

            // TODO find signer

            const { method: {
                args, method, section
            }} = ex;

            if(section === "system" && method === "remark"){

                const remark = args.toString();

                if(remark.indexOf("") === 0){

                    // const remrk = '0x726d726b3a3a4255593a3a302e313a3a306166663638363562656433613636622d56414c48454c4c4f2d504f54494f4e5f4845414c2d30303030303030303030303030303031';
                    // const uri = hexToString(remrk);
                    const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const reader = new RmrkReader(this.chain);
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    console.log(rmrkReader);

                    blockRmrks.push({
                        block : blockNumber,
                        rmrk : lisibleUri,
                    });
                }
            }

        })
        console.log(blockRmrks);
        return blockRmrks;
    }




}

const scan = new ScanBlock(new Kusama());


// FAIL
// scan.getRmrks(5445790);

// Human Json (file)
// scan.getRmrks(5445689);

//Send
// scan.getRmrks(5437975);

// MintNft
scan.getRmrks(5420541);

// Mint
// scan.getRmrks(5083411);
