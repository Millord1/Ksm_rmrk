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
}
exports.Buy = Buy;
//# sourceMappingURL=Buy.js.map