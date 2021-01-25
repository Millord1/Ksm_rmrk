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

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let canonizeManager = new CSCanonizeManager();

let sandra = canonizeManager.getSandra();
let kusama = new KusamaBlockchain(sandra);


console.log(kusama.addressFactory.entityByRevValMap);


let myCollection = canonizeManager.createCollection({id:'my veryfirst collection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

let myAsset = canonizeManager.createAsset({assetId:'A great asset I made',imageUrl:"https://picsum.photos/400"});
let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');

myAsset.bindCollection(myCollection);
myCOntract.bindToCollection(myCollection);

let rmrkToken = new RmrkContractStandard(canonizeManager);
rmrkToken.setSn("0000000000000003");
let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);




tokenPath.bindToAssetWithContract(myCOntract,myAsset);




let gossiper = new Gossiper(canonizeManager.getTokenFactory());
let result = gossiper.exposeGossip();

let json = JSON.stringify(result,null,2); // pretty
//let json = JSON.stringify(result);
console.log(json);

const xmlhttp = new XMLHttpRequest();
xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
xmlhttp.setRequestHeader("Content-Type", "application/json");
xmlhttp.send(json);
xmlhttp.addEventListener("load", ()=>{
    console.log("complete");
});
