"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Send = void 0;
const Interaction_js_1 = require("../Interaction.js");
class Send extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, Send.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.nft = this.nftFromComputedId(splitted[3]);
        this.transaction.setDestination(this.chain.getAddressClass(splitted[4]));
    }
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false, false);
        return JSON.stringify(json);
    }
}
exports.Send = Send;
//# sourceMappingURL=Send.js.map