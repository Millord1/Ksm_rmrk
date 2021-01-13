import {SandraManager} from "./sandra/src/SandraManager.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";

let sandra = new SandraManager();
let kusama = new KusamaBlockchain(sandra);

let event = new BlockchainEvent(kusama.eventFactory,)

