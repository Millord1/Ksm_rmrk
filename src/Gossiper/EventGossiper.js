"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGossiper = void 0;
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
const BlockchainContract_1 = require("canonizer/src/canonizer/BlockchainContract");
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
const BlockchainEvent_1 = require("canonizer/src/canonizer/BlockchainEvent");
const GossiperManager_1 = require("./GossiperManager");
class EventGossiper extends GossiperManager_1.GossiperManager {
    constructor(remark, csCanonizeManager, chain) {
        super(chain, csCanonizeManager);
        this.contractId = remark.asset ? remark.asset.contractId : "";
        this.sn = remark.asset ? remark.asset.token.sn : "";
        this.signer = remark.transaction.source;
        this.receiver = remark.transaction.destination ? remark.transaction.destination : "";
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
    }
    async gossip() {
        if (this.sn == "") {
            return undefined;
        }
        const canonizeManager = this.canonizeManager;
        const sandra = canonizeManager.getSandra();
        const receiver = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.receiver, sandra);
        const address = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.signer, sandra);
        const contract = new BlockchainContract_1.BlockchainContract(this.chain.contractFactory, this.contractId, sandra, new RmrkContractStandard_1.RmrkContractStandard(canonizeManager));
        const contractStandard = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager, this.sn);
        let event = new BlockchainEvent_1.BlockchainEvent(this.chain.eventFactory, address, receiver, contract, this.txId, this.timestamp, '1', this.chain, this.blockId, contractStandard, sandra);
        // canonizeManager.gossipBlockchainEvents(this.chain).then(()=>{console.log("event gossiped " + this.blockId)});
    }
}
exports.EventGossiper = EventGossiper;
//# sourceMappingURL=EventGossiper.js.map