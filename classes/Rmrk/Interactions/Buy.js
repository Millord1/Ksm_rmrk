"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buy = void 0;
const Interaction_js_1 = require("../Interaction.js");
class Buy extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, Buy.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        this.nftId = this.nftFromComputedId(splitted[3]);
    }
    // public createBuy(){
    //     const splitted = this.rmrkToArray();
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //     return this;
    // }
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.Buy = Buy;
//# sourceMappingURL=Buy.js.map