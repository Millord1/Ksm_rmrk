"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
const Token_js_1 = require("./Token.js");
const Remark_js_1 = require("./Rmrk/Remark.js");
class Asset extends Entity_js_1.Entity {
    constructor(rmrk, chain, version, transaction, obj) {
        super(rmrk, Asset.name, chain, version, transaction);
        this.name = obj.name;
        this.metadata = obj.metadata;
        this.token = new Token_js_1.Token(this.rmrk, this.chain, this.version, this.transaction, obj.transferable, obj.sn, obj.collection, this);
    }
    // public rmrkToObject(obj: any){
    //
    //     this.name = obj.name;
    //     this.metadata = obj.metadata;
    //
    //
    // const token = new Token(this.rmrk, this.chain, this.version, this.transaction);
    // this.token = token.setDatas(obj.transferable, obj.sn, obj.collection, this);
    // this.getMetadatasContent();
    // if(obj.metadata != null){
    //     const metadatas = this.getMetadatasContent(obj.metadata);
    // }
    //
    //     return this;
    // }
    static createNftFromInteraction(rmrk, chain, transaction) {
        const splitted = rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const nftDatas = splitted[2].split(',');
        const obj = Entity_js_1.Entity.dataTreatment(nftDatas, Remark_js_1.Remark.entityObj);
        return new Asset(rmrk, chain, null, transaction, obj);
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
        json['issuer'] = this.transaction.source.address;
        // @ts-ignore
        json['receiver'] = this.transaction.destination.address;
        return (needStringify) ? JSON.stringify(json) : json;
    }
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map