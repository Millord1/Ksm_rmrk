import {Option} from "commander";
import {Polkadot} from "./classes/Blockchains/Polkadot.js";
import {Unique} from "./classes/Blockchains/Unique.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {RmrkJetski} from "./Kusama/RmrkJetski.js";
import {Send} from "./classes/Rmrk/Interactions/Send.js";
import {Mint} from "./classes/Rmrk/Interactions/Mint.js";
import {SandraManager} from "./sandra/src/SandraManager.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Substrate/Kusama/KusamaBlockchain.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {Gossiper} from "./sandra/src/Gossiper.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export const testScan = async (opts: Option) => {

    let blockchain;

    // @ts-ignore
    switch (opts.chain.toLowerCase()){

        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            // blockchain = new Unique();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;
    }


    const scan = new RmrkJetski(blockchain);

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
                    let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra,new RmrkContractStandard(sandra));

                    const txId = '0x6c6520706f7374206d61726368652073616e73206a7175657279';

                    let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, '123456', '1', blockchain, 555, sandra);

                    let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
                    const json = JSON.stringify(gossiper.exposeGossip());
                    console.log(json);

                    // console.log(json);

                    const xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.send(json);
                    xmlhttp.addEventListener("load", ()=>{
                        console.log("complete");
                    });

                }

            })
        }
    );
}