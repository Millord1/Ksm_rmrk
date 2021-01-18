"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
const Remark_js_1 = require("./Remark.js");
const Asset_js_1 = require("../Asset.js");
class Interaction extends Remark_js_1.Remark {
    constructor(rmrk, interaction, chain, version, signer) {
        super(version, rmrk, chain, signer);
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
    nftFromComputedId(computed) {
        let nftDatas = this.checkDatasLength(computed.split('-'), 3);
        // @ts-ignore
        this.nft.collection = nftDatas[0];
        // @ts-ignore
        this.nft.name = nftDatas[1];
        // @ts-ignore
        this.nft.sn = nftDatas[2];
        const nft = new Asset_js_1.Asset(this.rmrk, this.chain, this.version, this.signer);
        return nft.rmrkToObject(this.nft);
    }
    checkDatasLength(datas, length) {
        if (datas.length > length) {
            const name = datas[0] + '-' + datas[1];
            datas.splice(0, 2);
            const sn = datas[datas.length - 1];
            let isNumber = true;
            for (let i = 0; i < sn.length; i++) {
                if (isNaN(parseInt(sn[i]))) {
                    isNumber = false;
                }
            }
            if (isNumber) {
                const serialN = sn;
                datas.pop();
                let nftName = '';
                for (let i = 0; i < datas.length; i++) {
                    let first = (i === 0) ? '' : '-';
                    nftName += first + datas[i];
                }
                datas = [];
                datas.unshift(serialN);
                datas.unshift(nftName);
                datas.unshift(name);
            }
        }
        return datas;
    }
}
exports.Interaction = Interaction;
//# sourceMappingURL=Interaction.js.map