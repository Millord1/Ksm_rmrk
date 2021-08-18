"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeIssuer = void 0;
const Interaction_1 = require("./Interaction");
class ChangeIssuer extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        const rmrkArray = rmrk.split('::');
        this.newOwner = rmrkArray.pop();
        this.collectionId = rmrkArray.pop();
    }
    getEntity() {
        return undefined;
    }
}
exports.ChangeIssuer = ChangeIssuer;
//# sourceMappingURL=ChangeIssuer.js.map