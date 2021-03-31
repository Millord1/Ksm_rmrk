"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
const Remark_1 = require("../Remark");
const Entity_1 = require("../Entities/Entity");
const VersionChecker_1 = require("../VersionChecker");
class Interaction extends Remark_1.Remark {
    constructor(rmrk, chain, transaction, version) {
        super(rmrk, chain, version);
        this.transaction = transaction;
    }
    addComputedForMintNft(nftData) {
        // For MintNft only (without sn)
        nftData.contractId = this.transaction.blockId + '-' + nftData.collection + '-' + nftData.instance;
        return nftData;
    }
    slugifyCollectionObj(collectionData) {
        for (let [key, value] of Object.entries(collectionData)) {
            if (typeof value == "string") {
                value = Entity_1.Entity.slugification(value);
            }
        }
        return collectionData;
    }
    slugifyNftObj(nftData) {
        for (let [key, value] of Object.entries(nftData)) {
            if (typeof value == "string") {
                value = Entity_1.Entity.slugification(value);
            }
        }
        return nftData;
    }
    splitRmrk() {
        return this.rmrk.split('::');
    }
    assetFromComputedId(rmrkArray) {
        // Return NftInterface from computedId, depending version of remark
        // For interactions except MintNft
        const version = rmrkArray[2];
        let nft = undefined;
        if (version.includes("1.0.0") || this.version.includes("1.0.0")) {
            nft = this.nftFromComputedVOne(rmrkArray);
        }
        if (nft) {
            nft = this.slugifyNftObj(nft);
        }
        return nft;
    }
    nftFromComputedVOne(rmrkArray) {
        // Transform computed ID to NftInterface with v1.0.0 compatibility
        const isComputed = rmrkArray.pop();
        let computedId = "";
        if (typeof isComputed == "string") {
            computedId = isComputed;
        }
        const assetData = computedId.split('-');
        if (assetData.length != 5 || Number.isNaN(assetData[4]) || Number.isNaN(assetData[0])) {
            return undefined;
        }
        const sn = assetData[4];
        if (computedId.includes(sn)) {
            // delete sn from computedID
            computedId = computedId.replace('-' + sn, "");
        }
        let nft;
        try {
            nft = {
                collection: assetData[1],
                sn: sn,
                transferable: true,
                name: assetData[3],
                metadata: "",
                currentOwner: "",
                instance: assetData[2],
                contractId: computedId
            };
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
        const versionChecker = new VersionChecker_1.VersionChecker(this.version);
        if (versionChecker.checkAssetVersion(nft)) {
            return nft;
        }
        return undefined;
    }
}
exports.Interaction = Interaction;
//# sourceMappingURL=Interaction.js.map