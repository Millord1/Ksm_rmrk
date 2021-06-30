"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGossiper = void 0;
const Asset_1 = require("../Remark/Entities/Asset");
const Collection_1 = require("../Remark/Entities/Collection");
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
const MetaData_1 = require("../Remark/MetaData");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
const GossiperManager_1 = require("./GossiperManager");
class EntityGossiper extends GossiperManager_1.GossiperManager {
    constructor(entity, blockId, source, csCanonizeManager, chain) {
        var _a, _b, _c;
        super(chain, csCanonizeManager);
        this.entityName = entity.constructor.name;
        // use instanceof for typescript typing
        if (entity instanceof Asset_1.Asset) {
            this.collectionId = entity.token.collectionId;
            this.assetId = entity.contractId;
            this.assetName = entity.name;
        }
        else if (entity instanceof Collection_1.Collection) {
            this.collectionId = entity.contract.id;
            this.collection = entity.contract.collection;
        }
        else {
            this.collectionId = "";
        }
        this.source = source;
        this.image = ((_a = entity.metaData) === null || _a === void 0 ? void 0 : _a.image) ? MetaData_1.MetaData.getCloudFlareUrl((_b = entity.metaData) === null || _b === void 0 ? void 0 : _b.image) : "";
        this.description = ((_c = entity.metaData) === null || _c === void 0 ? void 0 : _c.description) ? entity.metaData.description : "No description";
        this.blockId = blockId;
    }
    async gossip() {
        const canonizeManager = this.canonizeManager;
        const sandra = canonizeManager.getSandra();
        switch (this.entityName.toLowerCase()) {
            case Asset_1.Asset.name.toLowerCase():
                let assetId = "";
                if (this.assetId) {
                    assetId = this.assetId;
                }
                let assetName = "";
                if (this.assetName) {
                    assetName = this.assetName;
                }
                let assetContract = this.chain.contractFactory.getOrCreate(assetId);
                let myAsset = canonizeManager.createAsset({ assetId: assetId, imageUrl: this.image, description: this.description, name: assetName });
                let myCollection = canonizeManager.createCollection({ id: this.collectionId });
                myAsset.bindCollection(myCollection);
                assetContract.bindToCollection(myCollection);
                let rmrkToken = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
                assetContract.setStandard(rmrkToken);
                myAsset.bindContract(assetContract);
                // canonizeManager.gossipOrbsBindings().then(()=>{console.log("asset gossiped " + this.blockId)});
                break;
            case Collection_1.Collection.name.toLowerCase():
                let collection = "";
                if (this.collection) {
                    collection = this.collection;
                }
                let myContract = this.chain.contractFactory.getOrCreate(this.collectionId);
                const source = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.source, sandra);
                let canonizeCollection = canonizeManager.createCollection({ id: this.collectionId, imageUrl: this.image, name: collection, description: this.description });
                canonizeCollection.setOwner(source);
                myContract.bindToCollection(canonizeCollection);
                // canonizeManager.gossipCollection().then(()=>{console.log("collection gossiped " + this.blockId)});
                break;
            default:
                console.error('Something is wrong with Entity Gossip of ' + this.blockId);
                break;
        }
    }
}
exports.EntityGossiper = EntityGossiper;
break;
console.error('Something is wrong with Entity Gossip of ' + this.blockId);
break;
//# sourceMappingURL=EntityGossiper.js.map