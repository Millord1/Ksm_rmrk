"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetCollectionFactory = void 0;
const EntityFactory_js_1 = require("../EntityFactory.js");
class AssetCollectionFactory extends EntityFactory_js_1.EntityFactory {
    constructor(sandra) {
        super('assetCollection', 'assetCollectionFile', sandra);
        this.is_a = 'assetCollection';
        this.contained_in_file = 'assetCollectionFile';
        this.id = 'collectionId';
        this.updateOnExistingRef = sandra.get(this.id);
    }
}
exports.AssetCollectionFactory = AssetCollectionFactory;
AssetCollectionFactory.IMAGE_EXTENSION = 'imageExtension';
AssetCollectionFactory.MAIN_IMAGE = 'imageUrl';
AssetCollectionFactory.MAIN_NAME = 'name';
AssetCollectionFactory.DESCRIPTION = 'descriptiopn';
//# sourceMappingURL=AssetCollectionFactory.js.map