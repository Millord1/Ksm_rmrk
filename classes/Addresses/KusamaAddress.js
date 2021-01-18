"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KusamaAddress = void 0;
const BlockchainAddress_js_1 = require("./BlockchainAddress.js");
const Kusama_js_1 = require("../Blockchains/Kusama.js");
class KusamaAddress extends BlockchainAddress_js_1.BlockchainAddress {
    constructor() {
        super();
        this.blockchain = new Kusama_js_1.Kusama();
        this.blockchainName = this.blockchain.name;
    }
}
exports.KusamaAddress = KusamaAddress;
//# sourceMappingURL=KusamaAddress.js.map