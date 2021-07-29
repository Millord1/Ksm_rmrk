"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Interaction_1 = require("./Interaction");
const Asset_1 = require("../Entities/Asset");
class List extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        const rmrkArray = this.splitRmrk();
        let value = rmrkArray.pop();
        if (value) {
            this.value = Number(value);
        }
        const nft = this.assetFromComputedId(rmrkArray);
        if (nft) {
            this.asset = new Asset_1.Asset(this.rmrk, this.chain, nft);
        }
    }
    getEntity() {
        return this.asset;
    }
}
exports.List = List;
//# sourceMappingURL=List.js.map