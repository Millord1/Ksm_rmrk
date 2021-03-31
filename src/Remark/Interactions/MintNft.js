"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_1 = require("./Interaction");
const Asset_1 = require("../Entities/Asset");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const VersionChecker_1 = require("../VersionChecker");
class MintNft extends Interaction_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, chain, transaction);
        const signer = this.transaction.source;
        this.transaction.source = CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString;
        this.transaction.destination = signer;
        const asset = this.nftFromMintNft();
        if (asset) {
            this.asset = asset;
        }
    }
    nftFromMintNft() {
        const rmrkData = this.splitRmrk();
        const version = rmrkData[2];
        let nftData;
        try {
            nftData = JSON.parse(rmrkData[rmrkData.length - 1]);
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
        nftData = this.addComputedForMintNft(nftData);
        nftData = this.slugifyNftObj(nftData);
        const versionChecker = new VersionChecker_1.VersionChecker(this.version);
        if (versionChecker.checkAssetVersion(nftData)) {
            return new Asset_1.Asset(this.rmrk, this.chain, nftData, version);
        }
        return undefined;
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map