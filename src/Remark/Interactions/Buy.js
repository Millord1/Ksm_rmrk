"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buy = void 0;
const Interaction_1 = require("./Interaction");
const Asset_1 = require("../Entities/Asset");
class Buy extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        this.asset = this.assetToBuy();
    }
    assetToBuy() {
        const rmrkArray = this.splitRmrk();
        const nft = this.assetFromComputedId(rmrkArray);
        if (nft) {
            return new Asset_1.Asset(this.rmrk, this.chain, nft);
        }
        return undefined;
    }
    getEntity() {
        return this.asset;
    }
}
exports.Buy = Buy;
//# sourceMappingURL=Buy.js.map