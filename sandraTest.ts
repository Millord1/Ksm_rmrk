import {SandraManager} from "./sandra/src/SandraManager";
import {Kusama} from "./classes/Blockchains/Kusama";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {Gossiper} from "./sandra/src/Gossiper.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let sandra = new SandraManager();
let kusama = new KusamaBlockchain(sandra);


console.log(kusama.addressFactory.entityByRevValMap);

let event = new BlockchainEvent(kusama.eventFactory,'address1','addressDest1','contract1','txid1111','1111',"1",kusama,3,sandra);

console.log("event");

let gossiper = new Gossiper(kusama.eventFactory,sandra.get('txId'));
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
