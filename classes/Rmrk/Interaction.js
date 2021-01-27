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
        return new Asset_js_1.Asset(this.rmrk, this.chain, this.version, this.transaction, nftDatas, meta);
    }
    checkDatasLength(data) {
        const obj = Remark_js_1.Remark.entityObj;
        if (data.length === 3) {
            // Actual Rmrks (not allowed)
            // let collection: string = "";
            //
            // obj.sn = data[data.length -1];
            // data.splice(data.length -1, 1);
            //
            // obj.name = data[data.length -1];
            // data.splice(data.length -1, 1);
            //
            // for (let i = 0; i<data.length; i++){
            //     if(i != data.length-1){
            //         collection += data[i] + '-';
            //     }else{
            //         collection += data[i];
            //     }
            // }
            //
            // obj.collection = collection;
            // Normalization
            obj.collection = data[0];
            obj.name = data[1];
            obj.sn = data[2];
        }
        return obj;
    }
}
exports.Interaction = Interaction;
//# sourceMappingURL=Interaction.js.map