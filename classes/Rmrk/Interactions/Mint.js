"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mint = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Collection_js_1 = require("../../Collection.js");
class Mint extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, Mint.name, chain, null, transaction);
        this.collection = Collection_js_1.Collection.createCollectionFromInteraction(rmrk, chain, transaction, meta);
    }
    toJson() {
        const json = this.collection.toJson(false);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.Mint = Mint;
//# sourceMappingURL=Mint.js.map