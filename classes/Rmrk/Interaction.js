"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
const Remark_js_1 = require("./Remark.js");
const Asset_js_1 = require("../Asset.js");
class Interaction extends Remark_js_1.Remark {
    constructor(rmrk, interaction, chain, version, transaction) {
        super(version, rmrk, chain, transaction);
        this.toJsonSerialize = () => ({
            version: this.version,
            rmrk: this.rmrk,
            // @ts-ignore
            chain: this.chain.toJson(),
            interaction: this.interaction
        });
        this.interaction = interaction;
    }
    rmrkToArray() {
        return this.rmrk.split('::');
    }
    nftFromComputedId(computed, meta) {
        let nftDatas = this.checkDatasLength(computed.split('-'));
        const computedSplit = computed.split('-');
        const assetId = computedSplit[1] + '-' + computedSplit[2];
        return new Asset_js_1.Asset(this.rmrk, this.chain, this.version, this.transaction, nftDatas, assetId, meta);
    }
    static getComputedId(asset) {
        const blockId = asset.transaction.blockId;
        const collectionId = asset.token.contractId;
        const assetName = asset.name;
        const sn = asset.token.sn;
        return blockId + '-' + collectionId + '-' + assetName + '-' + sn;
    }
    checkDatasLength(data) {
        const obj = Remark_js_1.Remark.entityObj;
        if (this.version === 'RMRK0.1' || this.version === "0.1") {
            // Not allowed
            let collection = "";
            obj.sn = data[data.length - 1];
            data.splice(data.length - 1, 1);
            obj.name = data[data.length - 1];
            data.splice(data.length - 1, 1);
            for (let i = 0; i < data.length; i++) {
                if (i != data.length - 1) {
                    collection += data[i] + '-';
                }
                else {
                    collection += data[i];
                }
            }
            obj.collection = collection;
        }
        else if (this.version === "1.0.0") {
            // Normalization
            if (data.length === 4) {
                obj.collection = data[1];
                obj.name = data[2];
                obj.sn = data[3];
            }
        }
        return obj;
    }
}
exports.Interaction = Interaction;
//# sourceMappingURL=Interaction.js.map