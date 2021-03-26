"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainContract = void 0;
class BlockchainContract {
    constructor(chain, ccollectionData) {
        this.max = ccollectionData.max;
        this.symbol = ccollectionData.symbol;
        this.id = ccollectionData.id;
        this.chain = chain;
        this.collection = ccollectionData.name;
    }
}
exports.BlockchainContract = BlockchainContract;
//# sourceMappingURL=BlockchainContract.js.map