"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGossiper = void 0;
const Asset_1 = require("../Remark/Entities/Asset");
const Collection_1 = require("../Remark/Entities/Collection");
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
const BlockchainAddress_1 = require("canonizer/src/canonizer/BlockchainAddress");
const GossiperManager_1 = require("./GossiperManager");
const RmrkCanonizerWrapper_1 = require("canonizer/src/canonizer/Interfaces/Rmrk/RmrkCanonizerWrapper");
class EntityGossiper extends GossiperManager_1.GossiperManager {
    constructor(entity, blockId, source, csCanonizeManager, chain, emote) {
        var _a, _b;
        super(chain, csCanonizeManager);
        this.maxSupply = 0;
        if (emote) {
            this.emote = emote;
        }
        this.entityName = entity.constructor.name;
        // use instanceof for typescript typing
        if (entity instanceof Asset_1.Asset) {
            this.collectionId = entity.token.collectionId;
            this.assetId = entity.contractId;
            this.assetName = entity.name;
            this.sn = entity.token.sn;
        }
        else if (entity instanceof Collection_1.Collection) {
            this.collectionId = entity.contract.id;
            this.collection = entity.contract.collection;
            this.maxSupply = entity.contract.max;
        }
        else {
            this.collectionId = "";
        }
        this.source = source;
        // let image: string = "";
        // if(entity.metaData?.image){
        //     if(entity.metaData.image.includes('ipfs')){
        //         image = MetaData.getCloudFlareUrl(entity.metaData.image);
        //     }else{
        //         image = entity.metaData.image;
        //     }
        // }
        this.image = ((_a = entity.metaData) === null || _a === void 0 ? void 0 : _a.image) ? entity.metaData.image : "";
        // this.image = entity.metaData?.image ? MetaData.getCloudFlareUrl(entity.metaData?.image) : "";
        this.description = ((_b = entity.metaData) === null || _b === void 0 ? void 0 : _b.description) ? entity.metaData.description : "No description";
        this.blockId = blockId;
    }
    gossip() {
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
                // if(this.emote){
                //     myAsset.setEmote(this.emote);
                // }
                let myCollection = canonizeManager.createCollection({ id: this.collectionId });
                myAsset.bindCollection(myCollection);
                assetContract.bindToCollection(myCollection);
                let rmrkToken = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
                assetContract.setStandard(rmrkToken);
                myAsset.bindContract(assetContract);
                break;
            case Collection_1.Collection.name.toLowerCase():
                let collection = "";
                if (this.collection) {
                    collection = this.collection;
                }
                let myContract = this.chain.contractFactory.getOrCreate(this.collectionId);
                const source = new BlockchainAddress_1.BlockchainAddress(this.chain.addressFactory, this.source, sandra);
                const rmrkManager = new RmrkCanonizerWrapper_1.RmrkCanonizerWrapper(canonizeManager);
                let canonizeCollection = rmrkManager.createRmrkCollection({ id: this.collectionId, imageUrl: this.image, name: collection, description: this.description }, this.maxSupply, this.blockId);
                canonizeCollection.setOwner(source);
                myContract.bindToCollection(canonizeCollection);
                break;
            default:
                console.error('Something is wrong with Entity Gossip of ' + this.blockId);
        }
    }
}
exports.EntityGossiper = EntityGossiper;
//# sourceMappingURL=EntityGossiper.js.map