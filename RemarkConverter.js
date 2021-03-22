"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemarkConverter = void 0;
const AssetFactory_js_1 = require("./sandra/src/CSCannon/AssetFactory.js");
const AssetCollectionFactory_1 = require("./sandra/src/CSCannon/AssetCollectionFactory");
class RemarkConverter {
    constructor(sandra) {
        this.computedIdSeparator = '-';
        this.rmrkSeparator = '::';
        this.rmrkDefaultVersion = '1.0.0';
        this.sandra = sandra;
    }
    createMintRemark(collection, max, metaDataUrl, collectionId, symbol = "") {
        const collectionObj = {
            version: this.rmrkDefaultVersion,
            name: collection.getRefValue(AssetCollectionFactory_1.AssetCollectionFactory.MAIN_NAME),
            max: max,
            issuer: "",
            symbol: symbol,
            id: collectionId,
            metadata: metaDataUrl
        };
        const uri = this.objToUri(collectionObj);
        return 'rmrk' + this.rmrkSeparator + 'Mint' + this.rmrkSeparator + this.rmrkDefaultVersion + this.rmrkSeparator + uri;
    }
    createSendRemark(asset, contract, chain, serialNumber, receiver) {
        const cscToRemark = this.assetRmrkFromCscAsset(asset, serialNumber);
        const blockId = contract.getRefValue('id');
        const blockData = blockId.split('-');
        const blockNumber = (blockData.length > 2) ? Number(blockData[0]) : 0;
        const computedId = this.assetInterfaceToComputedId(cscToRemark, blockNumber);
        return 'rmrk' + this.rmrkSeparator + 'Send' + this.rmrkSeparator + this.rmrkDefaultVersion + this.rmrkSeparator + computedId + this.computedIdSeparator + receiver;
    }
    createMintNftRemark(asset, collection, serialNumber, transferable = true) {
        const assetRmrkObj = {
            collection: collection.getRefValue(AssetCollectionFactory_1.AssetCollectionFactory.MAIN_NAME),
            name: asset.getRefValue(AssetFactory_js_1.AssetFactory.ASSET_NAME),
            transferable: transferable,
            sn: serialNumber,
            metadata: asset.getRefValue(AssetFactory_js_1.AssetFactory.metaDataUrl),
            id: asset.getRefValue(AssetFactory_js_1.AssetFactory.ID)
        };
        const uri = this.objToUri(assetRmrkObj);
        return 'rmrk' + this.rmrkSeparator + 'MintNft' + this.rmrkSeparator + this.rmrkDefaultVersion + this.rmrkSeparator + uri;
    }
    assetRmrkFromCscAsset(asset, serialNumber) {
        const collection = asset.getJoinedCollections()[0];
        const cscToRemark = {
            collection: collection.getRefValue(this.sandra.get(AssetCollectionFactory_1.AssetCollectionFactory.MAIN_NAME)),
            name: asset.getRefValue(this.sandra.get(AssetFactory_js_1.AssetFactory.ASSET_NAME)),
            transferable: null,
            metadata: asset.getRefValue(this.sandra.get(AssetFactory_js_1.AssetFactory.metaDataUrl)),
            sn: serialNumber,
            id: asset.getRefValue(this.sandra.get(AssetFactory_js_1.AssetFactory.ID))
        };
        return cscToRemark;
    }
    objToUri(obj) {
        const toEncode = JSON.stringify(obj);
        return encodeURIComponent(toEncode);
    }
    assetInterfaceToComputedId(assetInterface, blockId) {
        return blockId + this.computedIdSeparator + assetInterface.collection + this.computedIdSeparator + assetInterface.id + this.computedIdSeparator + assetInterface.sn;
    }
}
exports.RemarkConverter = RemarkConverter;
//# sourceMappingURL=RemarkConverter.js.map