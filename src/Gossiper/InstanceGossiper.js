"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceGossiper = void 0;
const GossiperManager_1 = require("./GossiperManager");
const CanonizerJetski_1 = require("canonizer/src/canonizer/tools/jetski/CanonizerJetski");
const BlockchainBlock_1 = require("canonizer/src/canonizer/BlockchainBlock");
class InstanceGossiper extends GossiperManager_1.GossiperManager {
    constructor(chain, canonizeManager) {
        super(chain, canonizeManager);
    }
    sendLastBlock(block, instanceCode) {
        return new Promise((resolve, reject) => {
            const instance = instanceCode.toString();
            const sandra = this.canonizeManager.getSandra();
            const jetskiManager = new CanonizerJetski_1.CanonizerJetski(this.canonizeManager, instance);
            const blockObj = new BlockchainBlock_1.BlockchainBlock(this.chain.blockFactory, block, instance, sandra);
            const jetskiFactory = jetskiManager.getJetskifacory();
            const jetskiEntity = jetskiFactory.getOrCreateJetskiInstance(this.chain.getName(), blockObj, instance, sandra);
            jetskiEntity.setLatestBlock(blockObj);
            jetskiManager.gossipLatestBlock()
                .then(r => {
                console.log(r);
                resolve(r);
            }).catch(e => {
                reject(e);
            });
        });
    }
    checkInstance(blockchain, instanceCode) {
        // const instance = instanceCode.toString();
        // TODO get instance from XMLHttp ?
    }
}
exports.InstanceGossiper = InstanceGossiper;
//# sourceMappingURL=InstanceGossiper.js.map