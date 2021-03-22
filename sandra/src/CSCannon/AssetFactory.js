"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetFactory = void 0;
const EntityFactory_js_1 = require("../EntityFactory.js");
class AssetFactory extends EntityFactory_js_1.EntityFactory {
    constructor(sandra) {
        super('blockchainAsset', 'blockchainAssetFile', sandra);
        this.is_a = 'blockchainizableAsset';
        this.contained_in_file = 'blockchainizableAssets';
        this.updateOnExistingRef = sandra.get(AssetFactory.ID);
    }
}
exports.AssetFactory = AssetFactory;
AssetFactory.ID = 'assetId';
AssetFactory.imageUrl = 'imgUrl';
AssetFactory.metaDataUrl = 'metaDataUrl';
AssetFactory.tokenJoinVerb = 'bindToContract';
AssetFactory.collectionJoinVerb = 'bindToCollection';
AssetFactory.description = 'description';
AssetFactory.ASSET_NAME = 'name';
//# sourceMappingURL=AssetFactory.js.map