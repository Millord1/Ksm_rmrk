"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consume = void 0;
const Interaction_1 = require("./Interaction");
const Asset_1 = require("../Entities/Asset");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
class Consume extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        this.transaction.destination = CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString;
        const asset = this.nftFromComputedVOne(rmrk.split('::'));
        if (asset) {
            this.asset = new Asset_1.Asset(rmrk, this.chain, asset);
        }
    }
    getEntity() {
        return this.asset;
    }
}
exports.Consume = Consume;
//# sourceMappingURL=Consume.js.map