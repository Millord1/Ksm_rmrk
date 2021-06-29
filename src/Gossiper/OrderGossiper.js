"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderGossiper = void 0;
const GossiperManager_1 = require("./GossiperManager");
const Buy_1 = require("../Remark/Interactions/Buy");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
const BlockchainContract_1 = require("canonizer/src/canonizer/BlockchainContract");
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
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
        const source = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.signer, sandra);
        const buyAmount = String(this.amount);
        const sellPrice = String(this.value);
        const total = String(this.total);
        const txId = this.txId;
        const timestamp = this.timestamp;
        const ksmContractStd = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
        ksmContractStd.setSn(this.sn);
        const rmrkStd = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
        let contractSell;
        let contractBuy;
        if (this.sellContractId == "KSM") {
            // TODO after push canonizer
            // contractSell = new MainChainToken()
        }
        else {
            contractSell = new BlockchainContract_1.BlockchainContract(this.chain.contractFactory, this.sellContractId, sandra, new RmrkContractStandard_1.RmrkContractStandard(canonizeManager));
        }
        if (this.buyContractId == "KSM") {
            // TODO after push canonizer
            // contractBuy = new MainChainToken()
        }
        else {
            contractBuy = new BlockchainContract_1.BlockchainContract(this.chain.contractFactory, this.buyContractId, sandra, new RmrkContractStandard_1.RmrkContractStandard(canonizeManager));
        }
        // return new BlockchainOrder(this.chain.eventFactory, source, contractBuy, contractSell, buyAmount, sellPrice, total, txId, timestamp, this.chain, this.blockId, ksmContractStd, rmrkStd, sandra)
    }
}
exports.OrderGossiper = OrderGossiper;
//# sourceMappingURL=OrderGossiper.js.map