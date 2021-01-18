"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumAddressFactory = void 0;
const BlockchainAddressFactory_js_1 = require("./BlockchainAddressFactory.js");
class EthereumAddressFactory extends BlockchainAddressFactory_js_1.BlockchainAddressFactory {
    constructor() {
        super(...arguments);
        this.is_a = 'ethAddress';
        this.contained_in_file = 'ethAddressFile';
    }
}
exports.EthereumAddressFactory = EthereumAddressFactory;
//# sourceMappingURL=EthereumAddressFactory.js.map