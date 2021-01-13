import {Option} from "commander";
import {Polkadot} from "./classes/Blockchains/Polkadot.js";
import {Unique} from "./classes/Blockchains/Unique.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {ScanBlock} from "./Kusama/ScanBlock.js";
import {Send} from "./classes/Rmrk/Interactions/Send.js";
import {Mint} from "./classes/Rmrk/Interactions/Mint.js";
import {SandraManager} from "./sandra/src/SandraManager.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {Gossiper} from "./sandra/src/Gossiper.js";

const fs = require('fs');
const path = require('path');

// import * as $ from "jquery/JQuery.js";


export const testScan = async (opts: Option) => {

    let blockchain;

    // @ts-ignore
    switch (opts.chain.toLowerCase()){

        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            blockchain = new Unique();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;
    }


    const scan = new ScanBlock(blockchain);

    // @ts-ignore
    scan.getRmrks(opts.block).then(
        result => {

            result.forEach(value => {

                if(value instanceof Send || Mint){

                    let sandra = new SandraManager();
                    let blockchain = new KusamaBlockchain(sandra);

                    // @ts-ignore
                    const signer = value.signer;
                    let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);

                    // @ts-ignore
                    const recipient = value.recipient.address;
                    let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);

                    // @ts-ignore
                    const collName = (typeof value.nftId.contractId !== 'undefined') ? value.nftId.contractId : value.nftId.contract.collection;
                    let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra);

                    const txId = '0x01';

                    let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, '123456', '1', blockchain, sandra);

                    let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
                    const json = JSON.stringify(gossiper.exposeGossip());

                    // fs.writeFileSync(path.resolve(__dirname, "testJson.json"), json);

                    // let gossiper = new Gossiper(blockchainEventFactory,this.get(Blockchain.TXID_CONCEPT_NAME));
                    // JSON.stringify(gossiper.exposeGossip()),

                    $.ajax({
                        type: "POST",
                        url: 'http://arkam.everdreamsoft.com/alex/gossipTest',
                        data: json,
                        dataType: 'json',
                        success: () => {
                            console.log("success")
                        }
                    })
                }

            })
        }
    );
}