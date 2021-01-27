"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
const BlockchainContract_js_1 = require("./Contract/BlockchainContract.js");
const Remark_js_1 = require("./Rmrk/Remark.js");
class Collection extends Entity_js_1.Entity {
    constructor(rmrk, chain, version, transaction, obj, meta) {
        super(rmrk, Collection.name, chain, version, transaction, meta);
        this.name = obj.name;
        this.version = version;
        this.contract = new BlockchainContract_js_1.BlockchainContract(this.chain, obj.name, obj.id, obj.symbol, obj.max);
    }
    static createCollectionFromInteraction(rmrk, chain, transaction, meta) {
        const splitted = rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        // const datas = splitted[2].split(',');
        const obj = Entity_js_1.Entity.dataTreatment(splitted, Remark_js_1.Remark.entityObj);
        return new Collection(rmrk, chain, obj.version, transaction, obj, meta);
    }
    toJson(needStringify = true, needSubstrate = true) {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);
        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['contract'] = this.contract;
        return (needStringify) ? JSON.stringify(json) : json;
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map