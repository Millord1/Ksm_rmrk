"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
const Token_js_1 = require("./Token.js");
class Asset extends Entity_js_1.Entity {
    constructor(rmrk, chain, version, signer) {
        super(rmrk, Asset.name, chain, version, signer);
    }
    rmrkToObject(obj) {
        this.name = obj.name;
        this.metadata = obj.metadata;
        if (typeof obj.issuer != 'undefined') {
            // @ts-ignore
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }
        const token = new Token_js_1.Token(this.rmrk, this.chain, this.version, this.signer);
        this.token = token.setDatas(obj.transferable, obj.sn, obj.collection, this);
        return this;
    }
    createNftFromInteraction() {
        const splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const nftDatas = splitted[2].split(',');
        Entity_js_1.Entity.dataTreatment(nftDatas, this.nft);
        return this.rmrkToObject(this.nft);
    }
    toJson(needStringify = true, needSubstrate = true) {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);
        // @ts-ignore
        json['contractId'] = this.token.contractId;
        // @ts-ignore
        json['contract'] = this.token.contract;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['transferable'] = this.token.transferable;
        // @ts-ignore
        json['sn'] = this.token.sn;
        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['issuer'] = this.issuer;
        return (needStringify) ? JSON.stringify(json) : json;
    }
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map