"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossiperManager = void 0;
const WestEnd_1 = require("../Blockchains/WestEnd");
const WestendBlockchain_1 = require("canonizer/src/canonizer/Substrate/Westend/WestendBlockchain");
const Kusama_1 = require("../Blockchains/Kusama");
const KusamaBlockchain_1 = require("canonizer/src/canonizer/Kusama/KusamaBlockchain");
class GossiperManager {
    constructor(chain, canonizeManager) {
        this.canonizeManager = canonizeManager;
        this.chain = this.getCanonizeChain(chain);
    }
    getCanonizeChain(chainName) {
        const sandra = this.canonizeManager.getSandra();
        switch (chainName.toLowerCase()) {
            case WestEnd_1.WestEnd.name.toLowerCase():
                return new WestendBlockchain_1.WestendBlockchain(sandra);
            case Kusama_1.Kusama.name.toLowerCase():
            default:
                return new KusamaBlockchain_1.KusamaBlockchain(sandra);
        }
    }
}
exports.GossiperManager = GossiperManager;
//# sourceMappingURL=GossiperManager.js.map