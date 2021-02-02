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



const getJwt = ()=>{

    const env = load({
        JWT: String
    })

    assert.ok(env.JWT != "jwt_code");
    assert.ok(env.JWT != "");
    assert.ok(env.JWT != null);
    assert.ok(env.JWT != undefined);

    return env.JWT;
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
            //@ts-ignore
            blockchain = new Unique();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;
    }

    //@ts-ignore
    let blockN: number = opts.block;
    //@ts-ignore
    let nbOfBlocksToScan: number = opts.nb;

    if(nbOfBlocksToScan == 0){
        nbOfBlocksToScan = blockN;
    }

    const limitBlock: number = blockN - nbOfBlocksToScan;

    const scan = new RmrkJetski(blockchain);
    const api = await scan.getApi();

    setInterval(() => {

        scan.getRmrks(blockN, api).then(
            result => {

                result.forEach(value => {

                    if(typeof value === 'object'){

                        console.log(value);

                        let collName : string = "";
                        let sn: string = "";

                        if(value instanceof Send){

                            collName = value.nft.token.contractId;
                            sn = value.nft.token.sn

                            if(sn != "" && collName != ""){
                                    eventGossip(value, sn, collName);
                            }

                        }else if (value instanceof MintNft){

                            collName = value.nft.token.contractId;
                            sn = value.nft.token.sn

                            const source = value.transaction.source;
                            value.transaction.source = '0x0';
                            value.transaction.destination.address = source;

                            if(sn != "" && collName != ""){
                                entityGossip(value.nft)
                                eventGossip(value, sn, collName);
                            }

                        }else if (value instanceof Mint){

                            // collName = value.collection.name
                            entityGossip(value.collection);
                        }

                    }

                })

                if(blockN === limitBlock || blockN === 1){
                    process.exit();
                }
            },

        );

        blockN --;

    }, 250);


}




export const forceScan = async (block:number) => {

    let blockchain;



            blockchain = new Kusama();



    const scan = new RmrkJetski(blockchain);

    //@ts-ignore
    scan.getRmrks(block).then(
        result => {

            result.forEach(value => {

                let collName : string = "";
                let sn: string = "";

                if(value instanceof Send){

                    collName = value.nft.token.contractId;
                    sn = value.nft.token.sn

                    if(sn != "" && collName != ""){
                        eventGossip(value, sn, collName);
                    }

                }else if(value instanceof MintNft){

                    collName = value.nft.token.contractId;
                    sn = value.nft.token.sn

                    const source = value.transaction.source;
                    value.transaction.source = '0x0';
                    value.transaction.destination.address = source;

                    if(sn != "" && collName != ""){
                        entityGossip(value.nft)
                        eventGossip(value, sn, collName);
                    }

                }else if (value instanceof Mint){

                    // collName = value.collection.name;
                    entityGossip(value.collection);
                }


            })
        }
    );
}



const eventGossip = (value: Remark, sn: string, collName: string) => {

    const recipient = value.transaction.destination.address;

    const jwt = getJwt();

    let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
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

    canonizeManager.gossipBlockchainEvents(blockchain).then(r=>{console.log("event gossiped")});

}



const entityGossip = async (rmrk: Entity) => {

    const jwt = getJwt();

    let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
    let sandra = canonizeManager.getSandra();

    let kusama = new KusamaBlockchain(sandra);

    let collectionId : string = "";
    let nft: Asset;

    let result: any;

    let name: string = "";
    let image: string = "";
    let description: string = "";

    if(rmrk.metaDataContent != null){
        const meta = rmrk.metaDataContent

        if(meta.name != 'undefined'){
            name = "-"+meta.name;
        }else{
            name = "";
        }

        image = meta.image.replace("ipfs://",'https://ipfs.io/');
        description = meta.description;
    }

    if(rmrk instanceof Asset){

        collectionId = rmrk.token.contractId;
        nft = rmrk ;

        let myContract = kusama.contractFactory.getOrCreate(collectionId);

        let myAsset = canonizeManager.createAsset({assetId: collectionId + name, imageUrl: image,description:description});
        let myCollection = canonizeManager.createCollection({id: collectionId});


        myAsset.bindCollection(myCollection);
        myContract.bindToCollection(myCollection);

        let rmrkToken = new RmrkContractStandard(canonizeManager);
        myContract.setStandard(rmrkToken);

       // rmrkToken.setSn(nft.token.sn);
        //let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);

        myAsset.bindContract(myContract);

        //tokenPath.bindToAssetWithContract(myContract, myAsset);

        canonizeManager.gossipOrbsBindings().then(r=>{console.log("asset gossiped")});


    }else if (rmrk instanceof Collection){


        collectionId = rmrk.contract.id;

        let myContract = kusama.contractFactory.getOrCreate(collectionId);

        let myCollection = canonizeManager.createCollection({id: collectionId, imageUrl: image, name: rmrk.contract.collection, description: description});

        myContract.bindToCollection(myCollection);

        canonizeManager.gossipCollection().then(r=>{console.log("collection gossiped")});


    }

}


