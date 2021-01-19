"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KusamaAddress = void 0;
const BlockchainAddress_js_1 = require("./BlockchainAddress.js");
const Kusama_js_1 = require("../Blockchains/Kusama.js");
class KusamaAddress extends BlockchainAddress_js_1.BlockchainAddress {
    constructor(address) {
        super(address, "Kusama");
        this.blockchain = new Kusama_js_1.Kusama();
    }
}
exports.KusamaAddress = KusamaAddress;
//# sourceMappingURL=KusamaAddress.js.map