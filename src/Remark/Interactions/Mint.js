"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mint = void 0;
const Interaction_1 = require("./Interaction");
const Collection_1 = require("../Entities/Collection");
const VersionChecker_1 = require("../VersionChecker");
class Mint extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        const collection = this.collectionFromRmrk();
        if (collection) {
            this.collection = collection;
        }
    }
    collectionFromRmrk() {
        const rmrk = this.splitRmrk();
        let mintData;
        try {
            mintData = JSON.parse(rmrk[rmrk.length - 1]);
        }
        catch (e) {
            console.log(e);
            return undefined;
        }
        mintData = this.slugifyCollectionObj(mintData);
        const versionChecker = new VersionChecker_1.VersionChecker(this.version);
        if (versionChecker.checkCollectionVersion(mintData)) {
            return new Collection_1.Collection(this.rmrk, this.chain, mintData);
        }
        return undefined;
    }
}
exports.Mint = Mint;
//# sourceMappingURL=Mint.js.map