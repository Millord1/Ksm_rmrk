"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KusamaAddress = void 0;
const BlockchainAddress_js_1 = require("./BlockchainAddress.js");
class KusamaAddress extends BlockchainAddress_js_1.BlockchainAddress {
    // public blockchain: Blockchain
    constructor(address) {
        super(address, "Kusama");
        // this.blockchain = new Kusama();
    }
}
exports.KusamaAddress = KusamaAddress;
//# sourceMappingURL=KusamaAddress.js.map