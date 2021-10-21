"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderGossiper = void 0;
const GossiperManager_1 = require("./GossiperManager");
const Buy_1 = require("../Remark/Interactions/Buy");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
const BlockchainOrder_1 = require("canonizer/src/canonizer/BlockchainOrder");
const BlockchainContract_1 = require("canonizer/src/canonizer/BlockchainContract");
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
class OrderGossiper extends GossiperManager_1.GossiperManager {
    constructor(remark, csCanonizeManager, chain) {
        super(chain, csCanonizeManager);
        this.buyDestination = "";
        this.value = 1;
        this.amount = 1;
        this.total = 1;
        if (remark instanceof Buy_1.Buy) {
            this.buyContractId = remark.asset ? remark.asset.contractId : "";
            this.sellContractId = "KSM";
            this.buyDestination = remark.transaction.destination ? remark.transaction.destination : "";
            const amount = Number(remark.transaction.value);
            this.amount = remark.chain.plancksToCrypto(amount);
        }
        else {
            this.sellContractId = remark.asset ? remark.asset.contractId : "";
            this.buyContractId = "KSM";
            const value = Number(remark.value);
            this.value = remark.chain.plancksToCrypto(value);
        }
        this.sn = remark.asset ? remark.asset.token.sn : "";
        this.signer = remark.transaction.source;
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
        this.total = this.amount;
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
        let tokenToBuy;
        let tokenToSell;
        if (this.buyDestination != "") {
            // BUY
            tokenToSell = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
            tokenToBuy = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
            tokenToBuy.setSn(this.sn);
            tokenToBuy.generateTokenPathEntity(canonizeManager);
        }
        else {
            // LIST
            tokenToBuy = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
            tokenToSell = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
            tokenToSell.setSn(this.sn);
            tokenToSell.generateTokenPathEntity(canonizeManager);
        }
        let contractSell;
        let contractBuy;
        contractSell = new BlockchainContract_1.BlockchainContract(this.chain.contractFactory, this.sellContractId, sandra, new RmrkContractStandard_1.RmrkContractStandard(canonizeManager));
        contractBuy = new BlockchainContract_1.BlockchainContract(this.chain.contractFactory, this.buyContractId, sandra, new RmrkContractStandard_1.RmrkContractStandard(canonizeManager));
        let order = new BlockchainOrder_1.BlockchainOrder(this.chain.orderFactory, source, contractBuy, contractSell, sellPrice, buyAmount, total, txId, timestamp, this.chain, this.blockId, tokenToBuy, tokenToSell, sandra, this.buyDestination);
    }
}
exports.OrderGossiper = OrderGossiper;
//# sourceMappingURL=OrderGossiper.js.map