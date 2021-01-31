import {SandraManager} from "./sandra/src/SandraManager";
import {Kusama} from "./classes/Blockchains/Kusama";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {Gossiper} from "./sandra/src/Gossiper.js";
import {AssetCollection} from "./sandra/src/CSCannon/AssetCollection.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {AssetFactory} from "./sandra/src/CSCannon/AssetFactory.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {BlockchainTokenFactory} from "./sandra/src/CSCannon/BlockchainTokenFactory.js";
import {UniqueBlockchain} from "./sandra/src/CSCannon/Substrate/Unique/UniqueBlockchain.js";
import {UniqueContractStandard} from "./sandra/src/CSCannon/Interfaces/UniqueContractStandard.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//enter a jwt granting access to crystal suite
let jwt = '';

//initialisation do not change
let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
let sandra = canonizeManager.getSandra();

let currentBlockchain = new UniqueBlockchain(sandra);

bootstrap();


async function bootstrap(){


    const flush = await flushDatagraph() // add remove this to erase the full database
    const createTestCollection = await bootstrapCollection();
    const createTestEvent = await bootstrapEvents();

}



async function bootstrapCollection () {
    console.log("Creating Collection")

    let myCollection = canonizeManager.createCollection({
        id: 'myCollection',
        imageUrl: 'https://picsum.photos/400',
        name: 'my veryfirst collection',
        description: 'dolor'
    });

    let myAsset = canonizeManager.createAsset({
        assetId: 'MyGreatAsset',
        imageUrl: "https://picsum.photos/400",
        description: 'hello'
    });

    //now we instanciate the token
    let uniqueTokenId = "1" ;
    let uniqueCollectionId = "1" ; //Cs Cannon is contract


    let myContract = currentBlockchain.contractFactory.getOrCreate(uniqueCollectionId);

    //we add both the asset and the contract to the collection
    myAsset.bindCollection(myCollection);
    myContract.bindToCollection(myCollection);

    // we instanciate unique token id
    let uniqueToken = new UniqueContractStandard(canonizeManager);
    uniqueToken.setTokenId(uniqueTokenId);


    // now we bind our asset to a specific unique token
    let tokenPath = uniqueToken.generateTokenPathEntity(canonizeManager);
    tokenPath.bindToAssetWithContract(myContract,myAsset);




    myAsset.bindCollection(myCollection);
    myContract.bindToCollection(myCollection);
    myAsset.bindContract(myContract);

    //now that we build all relation between token and asset we are ready to publish it to the server
    let response = await canonizeManager.gossipOrbsBindings();
    console.log(JSON.parse(response));

}

async function bootstrapEvents (){
    console.log("Creating Events")

    let uniqueTokenId = "1" ;
    let uniqueCollectionId = "1" ;
    let timestamp = (Date.now()/1000).toString(); //Important the timestamp should be the block timestamp
    let blockId = 777 ;
    let quantity = "1" ;

    let uniqueToken = new UniqueContractStandard(canonizeManager);
    let myContract = currentBlockchain.contractFactory.getOrCreate(uniqueCollectionId).setStandard(uniqueToken)
    uniqueToken.setTokenId(uniqueTokenId);

    let event = new BlockchainEvent(currentBlockchain.eventFactory,
        'address1',
        'addressDest1',
        myContract,
        'txid1',
        timestamp,
        quantity,
        currentBlockchain,
        blockId,
        uniqueToken,
        canonizeManager.getSandra());


    let event2 = new BlockchainEvent(currentBlockchain.eventFactory,
        'address3',
        'address4',
        myContract,
        'txid2',
        timestamp+10,
        quantity,
        currentBlockchain,
        blockId+1,
        uniqueToken,
        canonizeManager.getSandra());


    //there is no need to dispatch event one by one. This should be done after all events are created. They will be all added
    let response = await canonizeManager.gossipBlockchainEvents(currentBlockchain);

    console.log(JSON.parse(response));

}


async function flushDatagraph (){

    let flushing = await canonizeManager.flushWithBlockchainSupport([currentBlockchain]).then(r=>{
        console.log("flushed and added blockchain support");
        console.log(JSON.parse(r));
        return r ;


    }).catch(

        err=>{console.log(err)}
    )
}




