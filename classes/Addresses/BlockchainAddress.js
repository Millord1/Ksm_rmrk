"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainAddress = void 0;
class BlockchainAddress {
    constructor(address, blockchainName) {
        this.address = address;
        this.blockchainName = blockchainName;
    }
    toJson() {
        return { blockchainName: this.blockchainName };
    }
}
exports.BlockchainAddress = BlockchainAddress;
//# sourceMappingURL=BlockchainAddress.js.map