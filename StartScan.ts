import {Option} from "commander";
import {Polkadot} from "./classes/Blockchains/Polkadot.js";
import {Unique} from "./classes/Blockchains/Unique.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {RmrkJetski} from "./Kusama/RmrkJetski.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Substrate/Kusama/KusamaBlockchain.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {Gossiper} from "./sandra/src/Gossiper.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {Mint} from "./classes/Rmrk/Interactions/Mint.js";
import {MintNft} from "./classes/Rmrk/Interactions/MintNft.js";
import {Send} from "./classes/Rmrk/Interactions/Send.js";
import {Interaction} from "./classes/Rmrk/Interaction.js";
import {Entity} from "./classes/Rmrk/Entity.js";
import {Remark} from "./classes/Rmrk/Remark.js";

const fs = require('fs');
const path = require('path');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export const testScan = async (opts: Option) => {

    let blockchain;

    // @ts-ignore
    switch (opts.chain.toLowerCase()){

        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            // TODO remake Unique Blockchain
            //@ts-ignore
            blockchain = new Unique();
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

                let collName : string = "";
                let sn: string = "";

                if(value instanceof Interaction){

                    if(value instanceof Send || value instanceof MintNft){

                        collName = value.nft.token.contractId;
                        sn = value.nft.token.sn

                    }else if (value instanceof Mint){

                        collName = value.collection.name;
                    }

                }else if(value instanceof Entity){

                    // TODO for Entities, create async function
                    Entity.getMetaDataContent(value.url)
                        .then((result) => {
                        value.metaDataContent = result;
                    })
                        .catch((e)=>{
                        console.error(e);
                        console.log('Error with the metadata call')
                    });

                }

                sendGossip(value, sn, collName);

            })
        }
    );
}




export const forceScan = async (block:number) => {

    let blockchain;



            blockchain = new Kusama();



    const scan = new RmrkJetski(blockchain);


    scan.getRmrks(block).then(
        result => {

            result.forEach(value => {

                let collName : string = "";
                let sn: string = "";

                if(value instanceof Send || value instanceof MintNft){

                    collName = value.nft.token.contractId;
                    sn = value.nft.token.sn

                }else if (value instanceof Mint){

                    collName = value.collection.name;
                }

                sendGossip(value, sn, collName);
            })
        }
    );
}



const sendGossip = (value: Remark, sn: string, collName: string) => {

    const recipient = value.transaction.destination.address;


    let canonizeManager = new CSCanonizeManager();
    let sandra =  canonizeManager.getSandra();
    let blockchain = new KusamaBlockchain(sandra);


    const signer = value.transaction.source;

    let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);

    let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);

    let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra,new RmrkContractStandard(canonizeManager));

    const txId = value.transaction.txHash;
    const timestamp = value.transaction.timestamp;
    const blockId = value.transaction.blockId;


    const contractStandard = new RmrkContractStandard(canonizeManager, sn);

    let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, timestamp, '1', blockchain, blockId, contractStandard, sandra);

    let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
    const json = JSON.stringify(gossiper.exposeGossip());


    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(json);
    xmlhttp.addEventListener("load", ()=>{
        console.log("complete");
    });
}