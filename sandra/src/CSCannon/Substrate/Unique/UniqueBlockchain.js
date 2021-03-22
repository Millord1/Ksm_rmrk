"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueBlockchain = void 0;
const Blockchain_js_1 = require("../../Blockchain.js");
class UniqueBlockchain extends Blockchain_js_1.Blockchain {
    constructor(sandra) {
        super(sandra, 'uniqueBlockchain');
        this.name = 'uniqueBlockchain';
        this.addressFactory.is_a = 'uniqueAddress';
        this.addressFactory.contained_in_file = 'uniqueAddressFile';
        this.contractFactory.is_a = 'uniqueContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';
    }
}
exports.UniqueBlockchain = UniqueBlockchain;
//# sourceMappingURL=UniqueBlockchain.js.map