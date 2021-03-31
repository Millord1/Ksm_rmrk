"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderGossiper = void 0;
const GossiperManager_1 = require("./GossiperManager");
const Buy_1 = require("../Remark/Interactions/Buy");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
class OrderGossiper extends GossiperManager_1.GossiperManager {
    constructor(remark, csCanonizeManager, chain) {
        super(chain, csCanonizeManager);
        this.amount = 1;
        if (remark instanceof Buy_1.Buy) {
            this.buyContractId = remark.asset ? remark.asset.contractId : "";
            this.sellContractId = "KSM";
        }
        else {
            this.sellContractId = remark.asset ? remark.asset.contractId : "";
            this.buyContractId = "KSM";
        }
        this.sn = remark.asset ? remark.asset.token.sn : "";
        this.signer = remark.transaction.source;
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
        const value = Number(remark.transaction.value);
        this.value = remark.chain.plancksToCrypto(value);
        this.total = this.value * this.amount;
    }
    gossip() {
        const canonizeManager = this.canonizeManager;
        const sandra = canonizeManager.getSandra();
        // TODO ContractStandard
        const source = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.signer, sandra);
    }
}
exports.OrderGossiper = OrderGossiper;
//# sourceMappingURL=OrderGossiper.js.map