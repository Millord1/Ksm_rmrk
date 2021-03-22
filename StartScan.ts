import {Option} from "commander";
import {Polkadot} from "./classes/Blockchains/Polkadot.js";
import {Unique} from "./classes/Blockchains/Unique.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {RmrkJetski} from "./Kusama/RmrkJetski.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Substrate/Kusama/KusamaBlockchain.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {Mint} from "./classes/Rmrk/Interactions/Mint.js";
import {MintNft} from "./classes/Rmrk/Interactions/MintNft.js";
import {Send} from "./classes/Rmrk/Interactions/Send.js";
import {Entity} from "./classes/Rmrk/Entity.js";
import {Remark} from "./classes/Rmrk/Remark.js";
import {Collection} from "./classes/Collection.js";
import {Asset} from "./classes/Asset.js";
import {Blockchain} from "./classes/Blockchains/Blockchain.js";
import {strict as assert} from "assert";
import {load} from "ts-dotenv";
import {ApiPromise} from "@polkadot/api";
import {WestEnd} from "./classes/Blockchains/WestEnd";

// 1er dec 5144100

// 1er fevrier 6024550

// Last block scanned 6715824

// Buy 6546060

export const getJwt = ()=>{

    const env = load({
        JWT: String
    })

    assert.ok(env.JWT != "jwt_code");
    assert.ok(env.JWT != "");
    assert.ok(env.JWT != null);
    assert.ok(env.JWT != undefined);

    return env.JWT;
}

function launchJetskiLoop(scan: RmrkJetski, api: ApiPromise, currentBlock: number, blockN: number) {

    // Assign setInterval return to a var so we can interrupt it later
    let interval: NodeJS.Timeout = setInterval(async () => {

        // Checks if API is disconnected, break loop, wait for a reconnect, relaunch loop
        if (!api.isConnected) {
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');
            api = await scan.getApi();
            console.log('API reconnected, loop will now restart');
            launchJetskiLoop(scan, api, --currentBlock, blockN);
        } else {

            if(currentBlock != blockN){
                currentBlock = blockN;

                scan.getRmrks(blockN, api)
                    .then(result => {
                        if(result.length > 0){

                            result.forEach(async value => {
                                if(typeof value === 'object'){
                                    console.log(value);
                                    dispatchForCanonizer(value);
                                }
                            })
                        }
                        blockN ++;
                    })
                    .catch( async (e)=>{
                        console.error(e);
                        console.log('Waiting for block ...');
                        setTimeout(()=>{
                            currentBlock --;
                        }, 10000);

                    })
            }
        }
    }, 1000 / 50);
}

export const testScan = async (opts: Option) => {

    let blockchain: Blockchain;

    //@ts-ignore
    switch (opts.chain.toLowerCase()){
        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            // TODO remake Unique Blockchain
            // @ts-ignore
            blockchain = new Unique();
        break;

        case 'westend':
            blockchain = new WestEnd();
            break;

        case "kusama":
            default:
            blockchain = new Kusama();
            break;

    }

    console.log(blockchain.constructor.name);

    //@ts-ignore
    let blockN: number = opts.block;

    let api: ApiPromise;

    const scan = new RmrkJetski(blockchain);
    api = await scan.getApi();

    let currentBlock: number = 0;

    // Launches the jetski loop
    launchJetskiLoop(scan, api, currentBlock, blockN);
}





export const forceScan = async (block:number) => {

    let blockchain;

    blockchain = new Kusama();

    const scan = new RmrkJetski(blockchain);
    const api = await scan.getApi();

    scan.getRmrks(block, api).then(
        result => {

            result.forEach(value => {

                if(typeof value === 'object'){
                    dispatchForCanonizer(value);
                    console.log(value);
                }

            })
        }
    );
}



export const scanOneBlock = async (opts: Option) => {

    let blockchain: Blockchain;

    //@ts-ignore
    switch (opts.chain.toLowerCase()){
        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            // TODO remake Unique Blockchain
            // @ts-ignore
            blockchain = new Unique();
            break;

        case 'westend':
            blockchain = new WestEnd();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;

    }

    console.log(blockchain.constructor.name);

    // @ts-ignore
    const blockN = opts.block;

    const chain = new Kusama();
    const jetski = new RmrkJetski(chain);
    const api = await jetski.getApi();

    jetski.getRmrks(blockN, api).then(result =>{

        result.forEach((rmrk)=>{

            if(typeof rmrk === "object"){
                // dispatchForCanonizer(rmrk);
                console.log(rmrk);
            }
        })

    })

}




const dispatchForCanonizer = async (value: Remark) => {

    let collName : string = "";
    let sn: string = "";

    // TODO Reactivate for Buy
    // if(value instanceof Send || value instanceof Buy){
    if(value instanceof Send){

        collName = value.nft.assetId;
        sn = value.nft.token.sn

        if(sn != "" && collName != ""){
            await eventGossip(value, sn, collName);
        }

    }else if (value instanceof MintNft){

        collName = value.nft.assetId;
        sn = value.nft.token.sn

        const source = value.transaction.source;
        value.transaction.source = CSCanonizeManager.mintIssuerAddressString;
        value.transaction.destination.address = source;

        if(sn != "" && collName != ""){
            entityGossip(value.nft).then( async ()=>{await eventGossip(value, sn, collName)} );
        }

    }else if (value instanceof Mint){
        await entityGossip(value.collection);
    }

}



const eventGossip = async (value: Remark, sn: string, collName: string) => {

    const signer = value.transaction.source;
    const recipient: string = value.transaction.destination.address;

    // TODO Activate For Buy

    // if (value instanceof Buy){
    //     recipient = value.transaction.transferDestination ? value.transaction.transferDestination : value.transaction.destination.address
    // }

    const jwt = getJwt();


    let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
    let sandra =  canonizeManager.getSandra();
    let blockchain = new KusamaBlockchain(sandra);

    let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);

    let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);

    let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra,new RmrkContractStandard(canonizeManager));

    const txId = value.transaction.txHash;
    const timestamp = value.transaction.timestamp;
    const blockId = value.transaction.blockId;


    const contractStandard = new RmrkContractStandard(canonizeManager, sn);

    let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, timestamp, '1', blockchain, blockId, contractStandard, sandra);

    canonizeManager.gossipBlockchainEvents(blockchain).then(r=>{console.log("event gossiped " + blockId)});

}



const entityGossip = async (rmrk: Entity) => {

    const jwt = getJwt();

    let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
    let sandra = canonizeManager.getSandra();

    let kusama = new KusamaBlockchain(sandra);

    let collectionId : string = "";

    let image: string = "";
    let description: string = "";
    const blockId: number = rmrk.transaction.blockId;

    if(rmrk.metaDataContent != null){
        const meta = rmrk.metaDataContent

        if(meta.description != 'undefined'){
            description = meta.description;
        }else{
            description = "No description";
        }

        if(meta.image != undefined){
            image = meta.image.replace("ipfs://",'https://cloudflare-ipfs.com/');
        }

    }

    if(rmrk instanceof Asset){

        collectionId = rmrk.token.contractId;

        let myContract = kusama.contractFactory.getOrCreate(rmrk.assetId);

        let myAsset = canonizeManager.createAsset({assetId: rmrk.assetId, imageUrl: image,description:description, name:rmrk.name});
        let myCollection = canonizeManager.createCollection({id: collectionId});

        myAsset.bindCollection(myCollection);
        myContract.bindToCollection(myCollection);

        let rmrkToken = new RmrkContractStandard(canonizeManager);
        myContract.setStandard(rmrkToken);

        myAsset.bindContract(myContract);

        canonizeManager.gossipOrbsBindings().then(r=>{console.log("asset gossiped " + blockId)});


    }else if (rmrk instanceof Collection){

        collectionId = rmrk.contract.id;

        let myContract = kusama.contractFactory.getOrCreate(collectionId);

        let myCollection = canonizeManager.createCollection({id: collectionId, imageUrl: image, name: rmrk.contract.collection, description: description});

        myContract.bindToCollection(myCollection);

        canonizeManager.gossipCollection().then(r=>{console.log("collection gossiped " + blockId)});

    }

}


