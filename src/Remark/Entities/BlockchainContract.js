"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainContract = void 0;
class BlockchainContract {
    constructor(chain, collectionData) {
        this.max = collectionData.max;
        this.symbol = collectionData.symbol;
        this.id = collectionData.id;
        this.chain = chain;
        this.collection = collectionData.name;
    }
}
exports.BlockchainContract = BlockchainContract;
//# sourceMappingURL=BlockchainContract.js.map