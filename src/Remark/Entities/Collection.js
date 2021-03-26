"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const Entity_1 = require("./Entity");
const BlockchainContract_1 = require("./BlockchainContract");
class Collection extends Entity_1.Entity {
    constructor(rmrk, chain, collectionData, version) {
        const rmrkV = version ? version : collectionData.version;
        super(rmrk, chain, collectionData.metadata, rmrkV);
        this.name = collectionData.name;
        this.collectionId = collectionData.id;
        this.contract = new BlockchainContract_1.BlockchainContract(this.chain, collectionData);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map