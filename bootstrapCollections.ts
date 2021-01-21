import {SandraManager} from "./sandra/src/SandraManager";
import {Kusama} from "./classes/Blockchains/Kusama";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {Gossiper} from "./sandra/src/Gossiper.js";
import {AssetCollection} from "./sandra/src/CSCannon/AssetCollection.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {AssetFactory} from "./sandra/src/CSCannon/AssetFactory.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let sandra = new SandraManager();
let kusama = new KusamaBlockchain(sandra);


console.log(kusama.addressFactory.entityByRevValMap);

let canonizer = new CSCanonizeManager();
let myCollection = canonizer.createCollection({id:'my veryfirst collection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

let myAsset = canonizer.createAsset({assetId:'A great asset I made'});

myAsset.bindCollection(myCollection);



let gossiper = new Gossiper(canonizer.getAssetFactory());
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
