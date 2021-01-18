"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainContract = void 0;
class BlockchainContract {
    createContract(obj, chain, collection) {
        this.chain = chain;
        this.collection = collection.name;
        this.version = obj.version;
        this.max = obj.max;
        this.symbol = obj.symbol;
        this.id = obj.id;
        // @ts-ignore
        this.issuer = (obj.issuer === null) ? undefined : this.chain.getAddressClass();
    }
}
exports.BlockchainContract = BlockchainContract;
//# sourceMappingURL=BlockchainContract.js.map