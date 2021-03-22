"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const Entity_js_1 = require("../Entity.js");
const AssetFactory_js_1 = require("./AssetFactory.js");
const Reference_js_1 = require("../Reference.js");
class Asset extends Entity_js_1.Entity {
    constructor(factory, assetInterface, sandra) {
        super(factory);
        this.sandra = sandra;
        this.addReference(new Reference_js_1.Reference(sandra.get(AssetFactory_js_1.AssetFactory.ID), assetInterface.assetId));
        assetInterface.imageUrl ? this.addReference(new Reference_js_1.Reference(sandra.get(AssetFactory_js_1.AssetFactory.imageUrl), assetInterface.imageUrl)) : null;
        assetInterface.metadataUrl ? this.addReference(new Reference_js_1.Reference(sandra.get(AssetFactory_js_1.AssetFactory.metaDataUrl), assetInterface.metadataUrl)) : null;
        assetInterface.description ? this.addReference(new Reference_js_1.Reference(sandra.get(AssetFactory_js_1.AssetFactory.description), assetInterface.description)) : null;
        assetInterface.name ? this.addReference(new Reference_js_1.Reference(sandra.get(AssetFactory_js_1.AssetFactory.ASSET_NAME), assetInterface.name)) : null;
    }
    bindContract(contract) {
        this.joinEntity(AssetFactory_js_1.AssetFactory.tokenJoinVerb, contract, this.sandra, [new Reference_js_1.Reference(this.sandra.get('sn'), 'canonizer')]);
    }
    getJoinedContracts() {
        // @ts-ignore
        return this.getJoinedEntitiesOnVerb(AssetFactory_js_1.AssetFactory.tokenJoinVerb);
    }
    getJoinedCollections() {
        // @ts-ignore
        return this.getJoinedEntitiesOnVerb(AssetFactory_js_1.AssetFactory.collectionJoinVerb);
    }
    bindCollection(assetCollection) {
        this.joinEntity(AssetFactory_js_1.AssetFactory.collectionJoinVerb, assetCollection, this.sandra);
    }
    getImageUrl() {
        return this.getRefValue(AssetFactory_js_1.AssetFactory.imageUrl);
    }
    setImageUrl(imgUrl) {
        this.createOrUpdateRef(AssetFactory_js_1.AssetFactory.imageUrl, imgUrl);
    }
    getId() {
        return this.getRefValue(AssetFactory_js_1.AssetFactory.ID);
    }
    getDescription() {
        return this.getRefValue(AssetFactory_js_1.AssetFactory.description);
    }
    setDescription(description) {
        return this.getRefValue(AssetFactory_js_1.AssetFactory.description);
    }
    setMetaDatasUrl(metaDatasUrl) {
        // TODO createOrUpdateRef
        // this.metaDatasUrl = metaDatasUrl;
    }
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map