"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemarkConverter = void 0;
const AssetFactory_js_1 = require("../sandra/src/CSCannon/AssetFactory.js");
const Remark_js_1 = require("./Rmrk/Remark.js");
const Send_js_1 = require("./Rmrk/Interactions/Send.js");
const MintNft_js_1 = require("./Rmrk/Interactions/MintNft.js");
const Collection_js_1 = require("./Collection.js");
const Asset_js_1 = require("./Asset.js");
const Mint_js_1 = require("./Rmrk/Interactions/Mint.js");
const util_1 = require("@polkadot/util");
const AssetCollectionFactory_js_1 = require("../sandra/src/CSCannon/AssetCollectionFactory.js");
class RemarkConverter {
    constructor() {
        this.collectionToRmrk = {
            version: "",
            name: "",
            max: 0,
            issuer: "",
            symbol: "",
            id: "",
            metadata: ""
        };
        this.assetToRmrk = {
            collection: "",
            name: "",
            transferable: null,
            sn: "",
            metadata: "",
            id: ""
        };
        this.computedIdSeparator = '-';
        this.rmrkSeparator = '::';
    }
    createMintRemark(collection, max, metaDataUrl, collectionId, symbol = "") {
        const collectionObj = {
            version: Remark_js_1.Remark.defaultVersion,
            name: collection.getRefValue(AssetCollectionFactory_js_1.AssetCollectionFactory.MAIN_NAME),
            max: max,
            issuer: "",
            symbol: symbol,
            id: collectionId,
            metadata: metaDataUrl
        };
        const uri = this.objToUri(collectionObj);
        const rmrk = 'rmrk' + this.rmrkSeparator + Mint_js_1.Mint.name + this.rmrkSeparator + Remark_js_1.Remark.defaultVersion + this.rmrkSeparator + uri;
        return util_1.stringToHex(rmrk);
    }
    createSendRemark(asset, chain, receiver, sandra) {
        const cscToRemark = this.assetRmrkFromCscAsset(asset, sandra);
        const contract = asset.getJoinedContracts();
        const blockId = contract[0].getRefValue('id');
        const blockData = blockId.split('-');
        const blockNumber = (blockData.length > 2) ? Number(blockData[0]) : 0;
        const computedId = this.assetInterfaceToComputedId(cscToRemark, blockNumber);
        const rmrk = 'rmrk' + this.rmrkSeparator + Send_js_1.Send.name + this.rmrkSeparator + computedId + receiver;
        return util_1.stringToHex(rmrk);
    }
    createMintNftRemark(asset, collection, transferable = true) {
        const assetRmrkObj = {
            collection: collection.getRefValue(AssetCollectionFactory_js_1.AssetCollectionFactory.MAIN_NAME),
            name: asset.getRefValue(AssetFactory_js_1.AssetFactory.ASSET_NAME),
            transferable: transferable,
            sn: "",
            metadata: asset.getRefValue(AssetFactory_js_1.AssetFactory.metaDataUrl),
            id: asset.getRefValue(AssetFactory_js_1.AssetFactory.ID)
        };
        const uri = this.objToUri(assetRmrkObj);
        const rmrk = 'rmrk' + this.rmrkSeparator + MintNft_js_1.MintNft.name + this.rmrkSeparator + Remark_js_1.Remark.defaultVersion + uri;
        return util_1.stringToHex(rmrk);
    }
    toRmrk(interaction) {
        if (interaction instanceof Send_js_1.Send) {
            const computedId = interaction.nft.assetId + '-' + interaction.nft.token.sn;
            const destination = interaction.transaction.destination.address;
            return 'rmrk' + this.rmrkSeparator + Send_js_1.Send.name + this.rmrkSeparator + computedId + this.rmrkSeparator + destination;
        }
        else if (interaction instanceof MintNft_js_1.MintNft) {
            const asset = this.getObjInterfaceFromEntity(interaction.nft);
            if (asset != null) {
                return 'rmrk' + this.rmrkSeparator + MintNft_js_1.MintNft.name + this.rmrkSeparator + interaction.version + this.rmrkSeparator + this.objToUri(asset);
            }
        }
        else if (interaction instanceof Mint_js_1.Mint) {
            const collection = this.getObjInterfaceFromEntity(interaction.collection);
            if (collection != null) {
                return 'rmrk' + this.rmrkSeparator + Mint_js_1.Mint.name + this.rmrkSeparator + interaction.version + this.rmrkSeparator + this.objToUri(collection);
            }
        }
        return "";
    }
    toHexRmrk(interaction) {
        return util_1.stringToHex(this.toRmrk(interaction));
    }
    assetRmrkFromCscAsset(asset, sandra) {
        const collection = asset.getJoinedCollections()[0];
        const cscToRemark = this.assetToRmrk;
        cscToRemark.collection = collection.getRefValue(sandra.get(AssetCollectionFactory_js_1.AssetCollectionFactory.MAIN_NAME));
        cscToRemark.name = asset.getRefValue(sandra.get(AssetFactory_js_1.AssetFactory.ASSET_NAME));
        cscToRemark.transferable = null;
        cscToRemark.metadata = asset.getRefValue(sandra.get(AssetFactory_js_1.AssetFactory.metaDataUrl));
        cscToRemark.id = asset.getRefValue(sandra.get(AssetFactory_js_1.AssetFactory.ID));
        return cscToRemark;
    }
    getObjInterfaceFromEntity(entity) {
        var _a, _b;
        if (entity instanceof Collection_js_1.Collection) {
            const collection = this.collectionToRmrk;
            collection.version = entity.version;
            collection.name = entity.name;
            collection.max = entity.contract.max;
            collection.issuer = entity.transaction.source;
            collection.symbol = entity.contract.symbol;
            collection.id = entity.contract.id;
            collection.metadata = (_a = entity.metaDataContent) === null || _a === void 0 ? void 0 : _a.url;
            return collection;
        }
        else if (entity instanceof Asset_js_1.Asset) {
            const asset = this.assetToRmrk;
            asset.collection = entity.token.contractId;
            asset.name = entity.name;
            asset.transferable = entity.token.transferable;
            asset.sn = entity.token.sn;
            asset.metadata = (_b = entity.metaDataContent) === null || _b === void 0 ? void 0 : _b.url;
            asset.id = entity.assetId;
            return asset;
        }
        else {
            return null;
        }
    }
    objToUri(obj) {
        const toEncode = JSON.stringify(obj);
        return encodeURIComponent(toEncode);
    }
    assetInterfaceToComputedId(assetInterface, blockId) {
        return blockId + this.computedIdSeparator + assetInterface.collection + this.computedIdSeparator + assetInterface.id + this.computedIdSeparator + assetInterface.sn;
    }
    RemarkFromCsc(assetInterface, blockId, recipient) {
        const cumputedId = this.assetInterfaceToComputedId(assetInterface, blockId);
        return 'rmrk' + this.rmrkSeparator + Send_js_1.Send.name + this.rmrkSeparator + Remark_js_1.Remark.defaultVersion + cumputedId + this.rmrkSeparator + recipient;
    }
}
exports.RemarkConverter = RemarkConverter;
//# sourceMappingURL=RemarkConverter.js.map