"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_1 = require("./Interaction");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
class MintNft extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        const signer = this.transaction.source;
        this.transaction.source = CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString;
        this.transaction.destination = signer;
        const asset = this.nftFromMintNft();
        if (asset) {
            this.asset = asset;
        }
    }
    getEntity() {
        return this.asset;
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map