"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeIssuerGossiper = void 0;
const GossiperManager_1 = require("./GossiperManager");
const ChangeIssuer_1 = require("canonizer/src/canonizer/ChangeIssuer");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
class ChangeIssuerGossiper extends GossiperManager_1.GossiperManager {
    constructor(remark, csCanonizeManager, chain) {
        super(chain, csCanonizeManager);
        let collectionId = "";
        let newOwner = "";
        if (remark.collectionId && remark.newOwner) {
            collectionId = remark.collectionId;
            newOwner = remark.newOwner;
        }
        this.source = remark.transaction.source;
        this.txId = remark.transaction.txHash;
        this.timestamp = remark.transaction.timestamp;
        this.blockId = remark.transaction.blockId;
        this.collectionId = collectionId;
        this.newOwner = newOwner;
    }
    async gossip() {
        const sandra = this.canonizeManager.getSandra();
        const source = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.source, sandra);
        const newIssuer = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.newOwner, sandra);
        let changeIssuer = new ChangeIssuer_1.ChangeIssuer(this.chain.changeIssuerFactory, source, this.collectionId, newIssuer, this.txId, this.timestamp, this.blockId, this.chain, sandra);
    }
}
exports.ChangeIssuerGossiper = ChangeIssuerGossiper;
//# sourceMappingURL=ChangeIssuerGossiper.js.map