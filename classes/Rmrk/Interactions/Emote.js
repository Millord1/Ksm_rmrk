"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emote = void 0;
const Interaction_js_1 = require("../Interaction.js");
class Emote extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, Emote.name, chain, null, transaction);
        const splittedRmrk = this.rmrkToArray();
        this.version = splittedRmrk[2];
        this.nft = this.nftFromComputedId(splittedRmrk[3], meta);
        this.unicode = splittedRmrk[4];
    }
}
exports.Emote = Emote;
//# sourceMappingURL=Emote.js.map