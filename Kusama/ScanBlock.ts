import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {Kusama} from "../classes/Blockchains/Kusama";
import {RmrkReader} from "./RmrkReader";
import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Polkadot} from "../classes/Blockchains/Polkadot";


class ScanBlock
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

                    // const remrk = '0x76616c68656c6c6f3a3a4845414c574954483a3a306166663638363562656433613636622d56414c48454c4c4f2d504f54494f4e5f4845414c2d303030303030303030303030303030313a3a43706a734c4443314a467972686d3366744339477334516f79726b484b685a4b744b37597147545246745461666770';
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
// const scan = new ScanBlock(new Polkadot());

// FAIL
// scan.getRmrks(5445790);

// Human Json (file)
// scan.getRmrks(5445790);

//Send
// scan.getRmrks(5437975);

// MintNft
// scan.getRmrks(5420541);

// Mint
// scan.getRmrks(5083411);

scan.getRmrks(5437975);