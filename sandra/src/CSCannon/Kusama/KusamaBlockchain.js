"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KusamaBlockchain = void 0;
const Blockchain_js_1 = require("../Blockchain.js");
class KusamaBlockchain extends Blockchain_js_1.Blockchain {
    constructor(sandra) {
        super(sandra);
        this.name = 'kusama';
        this.name = 'kusama';
        this.addressFactory.is_a = 'kusamaAddress';
        this.addressFactory.contained_in_file = 'kusamaAddressFile';
        this.addressFactory.onBlockchain = this.name;
        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';
    }
}
exports.KusamaBlockchain = KusamaBlockchain;
//# sourceMappingURL=KusamaBlockchain.js.map