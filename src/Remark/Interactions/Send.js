"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Send = void 0;
const Interaction_1 = require("./Interaction");
const Asset_1 = require("../Entities/Asset");
class Send extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        this.asset = this.assetToSend();
    }
    getEntity() {
        return this.asset;
    }
    assetToSend() {
        const rmrkArray = this.splitRmrk();
        const isReceiver = rmrkArray.pop();
        if (typeof isReceiver == "string") {
            this.transaction.destination = isReceiver;
        }
        const nft = this.assetFromComputedId(rmrkArray);
        if (nft) {
            return new Asset_1.Asset(this.rmrk, this.chain, nft);
        }
        return undefined;
    }
}
exports.Send = Send;
//# sourceMappingURL=Send.js.map