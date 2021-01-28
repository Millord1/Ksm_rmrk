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
let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8';

//initialisation do not change
let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
let sandra = canonizeManager.getSandra();


let unique = new UniqueBlockchain(sandra);

// this will erase all data in your datagraph environment (specified in the jwt) note some jwt allow or disallow flush
// remove this part if you don't want to delete your database data
canonizeManager.flushWithBlockchainSupport([unique]).then(r=>{

    console.log("flushed and added blockchain support");
    console.log(r);

}).catch(err=>{console.log(err)})


let uniqueCollectionId = "1" ; //On unique a collection is identified by a numerical id. On CScannon this equals a collection and a contract with the same identifier

let myCollection = canonizeManager.createCollection({id:uniqueCollectionId,imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

let myAsset = canonizeManager.createAsset({assetId:'A great asset I made',imageUrl:"https://picsum.photos/400",description:'hello'});
let myContract = unique.contractFactory.getOrCreate(uniqueCollectionId);

//we add both the asset and the contract to the collection
myAsset.bindCollection(myCollection);
myContract.bindToCollection(myCollection);

//now we instanciate the token
let uniqueTokenId = "1" ;
let uniqueToken = new UniqueContractStandard(canonizeManager);
uniqueToken.setTokenId(uniqueTokenId);

// now we bind our asset to a specific unique token
let tokenPath = uniqueToken.generateTokenPathEntity(canonizeManager);
tokenPath.bindToAssetWithContract(myContract,myAsset);

//now that we build all relation between token and asset we are ready to publish it to the server
let gossiper = new Gossiper(canonizeManager.getTokenFactory()); //it's important to gossip the token factory as it joins everything up to the collection
let result = gossiper.exposeGossip();


let json = JSON.stringify(result);
console.log(json);

const xmlhttp = new XMLHttpRequest();
xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
xmlhttp.setRequestHeader("Content-Type", "application/json");
xmlhttp.send(json);
xmlhttp.addEventListener("load", ()=>{
    console.log("complete");
});
