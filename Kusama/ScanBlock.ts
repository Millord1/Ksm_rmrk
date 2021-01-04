import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {Kusama} from "../classes/Blockchains/Kusama";
import {RmrkReader} from "./RmrkReader";
import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Polkadot} from "../classes/Blockchains/Polkadot";
const fs = require('fs');
const path = require('path');


class ScanBlock
{
    wsProvider;
    api;
    chain: Blockchain;
    toHide = [
        'defaultVersion',
        'nft',
        'collection'
    ];

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

        blockRmrks.push({block : blockNumber});

        block.block.extrinsics.forEach((ex) => {

            // TODO find signer

            const { method: {
                args, method, section
            }} = ex;

            if(section === "system" && method === "remark"){

                const remark = args.toString();

                if(remark.indexOf("") === 0){

                    const remrk = '0x7b2276657273696f6e223a2022524d524b302e31222c226e616d65223a22446f74204c656170204561726c792050726f6d6f74657273222c226d6178223a3130302c22697373756572223a2243706a734c4443314a467972686d3366744339477334516f79726b484b685a4b744b37597147545246745461666770222c2273796d626f6c223a22444c4550222c226964223a2022306166663638363562656433613636622d444c4550222c226d65746164617461223a22697066733a2f2f697066732f516d5667733850346177685a704658686b6b676e437742703441644b526a3346394b35386d435a366678766e336a227d';
                    const uri = hexToString(remrk);
                    // const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const reader = new RmrkReader(this.chain);
                    const rmrkReader = reader.readRmrk(lisibleUri);

                    const jason = JSON.stringify(rmrkReader);

                    fs.writeFileSync(path.resolve(__dirname, "testJson.json"), jason);

                    // console.log(jason);

                    blockRmrks.push({
                        rmrk : rmrkReader,
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

scan.getRmrks(4960562);