"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Interaction_js_1 = require("../Interaction.js");
class List extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, List.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.nft = this.nftFromComputedId(splitted[3], meta);
        this.quantity = splitted[4];
    }
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false);
        // @ts-ignore
        json['quantity'] = this.quantity;
        return JSON.stringify(json);
    }
}
exports.List = List;
//# sourceMappingURL=List.js.map