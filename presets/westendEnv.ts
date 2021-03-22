import {CSCanonizeManager} from "../sandra/src/CSCannon/CSCanonizeManager.js";
import {getJwt} from "../StartScan.js";
import {WestendBlockchain} from "../sandra/src/CSCannon/Substrate/Westend/WestendBlockchain.js";


let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:getJwt()}});

let sandra = canonizeManager.getSandra();


canonizeManager.addBlockchainSupport([new WestendBlockchain(sandra)]);
canonizeManager.gossipActiveBlockchain().then(r=>console.log(r));

