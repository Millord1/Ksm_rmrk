"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmoteGossiper = void 0;
const GossiperManager_1 = require("./GossiperManager");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
const BlockchainEmote_1 = require("canonizer/src/canonizer/BlockchainEmote");
const BlockchainContract_1 = require("canonizer/src/canonizer/BlockchainContract");
class EmoteGossiper extends GossiperManager_1.GossiperManager {
    constructor(remark, csCanonizeManager, chain) {
        super(chain, csCanonizeManager);
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
        this.source = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, remark.transaction.source, this.canonizeManager.getSandra());
        this.unicode = remark.unicode ? remark.unicode : "";
        if (remark.asset) {
            this.token = new RmrkContractStandard_1.RmrkContractStandard(csCanonizeManager);
            this.token.setSn(remark.asset.token.sn);
            this.contract = new BlockchainContract_1.BlockchainContract(this.chain.contractFactory, remark.asset.contractId, this.canonizeManager.getSandra());
        }
    }
    async gossip() {
        if (this.token && this.contract) {
            const emote = new BlockchainEmote_1.BlockchainEmote(this.chain.emoteFactory, this.canonizeManager.getSandra(), this.chain, this.source, this.txId, this.blockId, this.timestamp, this.unicode, this.token, this.contract);
        }
    }
}
exports.EmoteGossiper = EmoteGossiper;
//# sourceMappingURL=EmoteGossiper.js.map