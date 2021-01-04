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

                    // const remrk = '0x726d726b3a3a4d494e544e46543a3a253742253232636f6c6c656374696f6e253232253341253232306166663638363562656433613636622d444c45502532322532432532326e616d65253232253341253232444c31352532322532432532327472616e7366657261626c6525323225334131253243253232736e253232253341253232303030303030303030303030303030312532322532432532326d657461646174612532322533412532326970667325334125324625324669706673253246516d61766f54566256486e4745557a746e425432703372696633714250654366797955453576345a376f467673342532322537440a';
                    // const uri = hexToString(remrk);
                    const uri = hexToString(remark);
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

scan.getRmrks(5437975);