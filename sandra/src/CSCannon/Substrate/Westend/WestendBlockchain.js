"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WestendBlockchain = void 0;
const Blockchain_js_1 = require("../../Blockchain.js");
class WestendBlockchain extends Blockchain_js_1.Blockchain {
    constructor(sandra) {
        super(sandra, 'westend');
        this.name = 'westend';
        this.name = 'westend';
        this.addressFactory.is_a = 'westendAddress';
        this.addressFactory.contained_in_file = 'kusamaAddressFile';
        this.addressFactory.onBlockchain = this.name;
        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';
    }
}
exports.WestendBlockchain = WestendBlockchain;
//# sourceMappingURL=WestendBlockchain.js.map