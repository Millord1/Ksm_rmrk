"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
const Token_js_1 = require("./Token.js");
const Remark_js_1 = require("./Rmrk/Remark.js");
class Asset extends Entity_js_1.Entity {
    constructor(rmrk, chain, version, transaction, obj, assetId, meta) {
        super(rmrk, Asset.name, chain, version, transaction, meta);
        this.name = obj.name;
        this.instance = obj.instance;
        this.assetId = assetId;
        this.token = new Token_js_1.Token(obj.transferable, obj.sn, obj.collection);
    }
    static createNftFromInteraction(rmrk, chain, transaction, meta) {
        const splitted = rmrk.split('::');
        // splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        // let nftDatas: Array<string> = [];
        //
        // if(splitted.length >= 3){
        //     nftDatas = splitted[3].split(',');
        // }else{
        //     nftDatas = splitted[splitted.length - 1].split(',');
        // }
        const nftDatas = splitted[splitted.length - 1].split(',');
        const obj = Entity_js_1.Entity.dataTreatment(nftDatas, Remark_js_1.Remark.entityObj);
        const assetId = transaction.blockId + '-' + obj.collection + '-' + obj.instance;
        return new Asset(rmrk, chain, null, transaction, obj, assetId, meta);
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