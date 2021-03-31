"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emote = void 0;
const Interaction_1 = require("./Interaction");
const Asset_1 = require("../Entities/Asset");
class Emote extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        const rmrkArray = this.splitRmrk();
        const unicode = rmrkArray.pop();
        if (typeof unicode === "string") {
            this.unicode = unicode;
        }
        const nft = this.assetFromComputedId(rmrkArray);
        if (nft) {
            this.asset = new Asset_1.Asset(this.rmrk, this.chain, nft);
        }
    }
}
exports.Emote = Emote;
//# sourceMappingURL=Emote.js.map