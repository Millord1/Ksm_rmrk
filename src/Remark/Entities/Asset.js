"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const Entity_1 = require("./Entity");
const Token_1 = require("./Token");
class Asset extends Entity_1.Entity {
    constructor(rmrk, chain, nftData, version) {
        super(rmrk, chain, nftData.metadata, version);
        this.name = nftData.name;
        this.instance = nftData.instance;
        this.contractId = nftData.contractId;
        this.token = new Token_1.Token(nftData.sn, nftData.collection, nftData.transferable);
    }
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map