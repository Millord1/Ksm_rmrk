"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Asset_js_1 = require("../../Asset.js");
class MintNft extends Interaction_js_1.Interaction {
    // TODO : collection ID différent for Asset and MintNft
    // value.nft.token.contractId
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, MintNft.name, chain, null, transaction);
        this.nft = Asset_js_1.Asset.createNftFromInteraction(rmrk, chain, transaction, meta);
    }
    toJson() {
        const json = this.nft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map