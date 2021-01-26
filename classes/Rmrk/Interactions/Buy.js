"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buy = void 0;
const Interaction_js_1 = require("../Interaction.js");
class Buy extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, Buy.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        this.nft = this.nftFromComputedId(splitted[3], meta);
    }
    // public createBuy(){
    //     const splitted = this.rmrkToArray();
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //     return this;
    // }
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nft.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.Buy = Buy;
//# sourceMappingURL=Buy.js.map