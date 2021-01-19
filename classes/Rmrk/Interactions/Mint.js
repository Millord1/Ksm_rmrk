"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mint = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Collection_js_1 = require("../../Collection.js");
class Mint extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, Mint.name, chain, null, transaction);
        //@ts-ignore
        const myCollection = new Collection_js_1.Collection(this.rmrk, this.chain, null, this.transaction);
        this.myCollection = myCollection.createCollectionFromInteraction();
        return this;
    }
    toJson() {
        const json = this.myCollection.toJson(false);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.Mint = Mint;
//# sourceMappingURL=Mint.js.map