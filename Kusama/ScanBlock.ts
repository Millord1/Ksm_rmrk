import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {Kusama} from "../classes/Blockchains/Kusama";
import {RmrkReader} from "./RmrkReader";
import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Polkadot} from "../classes/Blockchains/Polkadot";
import {Unique} from "../classes/Blockchains/Unique";
import {Remark} from "../classes/Rmrk/Remark";
import {Send} from "../classes/Rmrk/Interactions/Send";
import {Mint} from "../classes/Rmrk/Interactions/Mint";
import {SandraManager} from "../sandra/src/SandraManager";
import {BlockchainEvent} from "../sandra/src/CSCannon/BlockchainEvent";
import {BlockchainAddress} from "../sandra/src/CSCannon/BlockchainAddress";
import {BlockchainContract} from "../sandra/src/CSCannon/BlockchainContract";
import {KusamaBlockchain} from "../sandra/src/CSCannon/Kusama/KusamaBlockchain";
import {Gossiper} from "../sandra/src/Gossiper";
const fs = require('fs');
const path = require('path');


export class ScanBlock
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


    // @ts-ignore
    public async getRmrks(blockNumber: number): Promise < Array<Remark> >{


        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        const blockRmrks = [];

        // blockRmrks.push({block : blockNumber});

        block.block.extrinsics.forEach((ex) => {

            // TODO find signer
            // TODO Tx Id

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

                    // console.log(rmrkReader);

                    blockRmrks.push(rmrkReader);
                }
            }

        })

        // console.log(blockRmrks);

        return blockRmrks;
    }


}

// const scan = new ScanBlock(new Kusama());
// const scan = new ScanBlock(new Polkadot());
// const scan = new ScanBlock(new Unique());

// scan.getRmrks();

// FAIL
// scan.getRmrks(5445790);

// Human Json (file)
// scan.getRmrks(5445790);

//Send
// scan.getRmrks(5437975).then(
//     result => {
//         result.forEach(value => {
//
//             // console.log(value.nftId.contractId);
//
//             if(value instanceof Send || Mint){
//
//                 let sandra = new SandraManager();
//                 let blockchain = new KusamaBlockchain(sandra);
//
//                 // TODO Signer
//                 const signer = '0x0000';
//                 let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);
//
//                 // @ts-ignore
//                 const recipient = value.recipient.address;
//                 let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);
//
//                 // @ts-ignore
//                 const collName = (typeof value.nftId.contractId !== 'undefined') ? value.nftId.contractId : value.nftId.contract.collection;
//                 let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra);
//
//                 const txId = '0xId';
//
//                 let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, '123456', '1', blockchain, sandra);
//
//                 let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
//                 const json = JSON.stringify(gossiper.exposeGossip());
//
//                 fs.writeFileSync(path.resolve(__dirname, "testJson.json"), json);
//
//                 // let gossiper = new Gossiper(blockchainEventFactory,this.get(Blockchain.TXID_CONCEPT_NAME));
//                 // JSON.stringify(gossiper.exposeGossip()),
//             }
//
//         })
//     }
// );



// MintNft
// scan.getRmrks(5420541);

// Mint
// scan.getRmrks(5083411);

// scan.getRmrks(2176215);