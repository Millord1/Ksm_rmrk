import {SandraManager} from "./sandra/src/SandraManager";
import {Kusama} from "./classes/Blockchains/Kusama";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";

let sandra = new SandraManager();
let kumsa = new KusamaBlockchain(sandra);


console.log(kumsa.addressFactory.entityByRevValMap);

let event = new BlockchainEvent(kumsa.eventFactory,'dddd','dfff','sdfdsf','dsaf','1111',"1",kumsa,sandra);

console.log("event");
console.log(event.subjectConcept.triplets);
