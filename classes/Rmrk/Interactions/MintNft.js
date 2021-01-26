"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Asset_js_1 = require("../../Asset.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
class MintNft extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, MintNft.name, chain, null, transaction);
        this.nft = Asset_js_1.Asset.createNftFromInteraction(rmrk, chain, transaction);
        const issuer = this.transaction.source;
        this.transaction.source = '0x0';
        this.transaction.destination.address = issuer;
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