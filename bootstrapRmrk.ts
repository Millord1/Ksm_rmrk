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

let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8';

let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});

let sandra = canonizeManager.getSandra();
let kusama = new KusamaBlockchain(sandra);

canonizeManager.flushWithBlockchainSupport([kusama]).then(r=>{

    console.log("flushed and added blockchain support");
    console.log(r);

}).catch(

    err=>{console.log(err)}
    )




console.log(kusama.addressFactory.entityByRevValMap);

let rmrkContractStandard = new RmrkContractStandard(canonizeManager);

let myCollection = canonizeManager.createCollection({id:'myCollection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

let myAsset = canonizeManager.createAsset({assetId:'A great asset I made',imageUrl:"https://picsum.photos/400",description:'hello'});
let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL').setStandard(rmrkContractStandard);


myAsset.bindCollection(myCollection);
myCOntract.bindToCollection(myCollection);
myAsset.bindContract(myCOntract);

//now that we build all relation between token and asset we are ready to publish it to the server
let gossiper = new Gossiper(canonizeManager.getAssetFactory()); //it's important to gossip the token factory as it joins everything up to the collection
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


