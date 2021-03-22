"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSCanonizeManager_js_1 = require("../sandra/src/CSCannon/CSCanonizeManager.js");
const StartScan_js_1 = require("../StartScan.js");
const WestendBlockchain_js_1 = require("../sandra/src/CSCannon/Substrate/Westend/WestendBlockchain.js");
let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: StartScan_js_1.getJwt() } });
let sandra = canonizeManager.getSandra();
canonizeManager.addBlockchainSupport([new WestendBlockchain_js_1.WestendBlockchain(sandra)]);
canonizeManager.gossipActiveBlockchain().then(r => console.log(r));
//# sourceMappingURL=westendEnv.js.map