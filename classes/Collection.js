"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
class Collection extends Entity_js_1.Entity {
    constructor(rmrk, chain, version, transaction) {
        super(rmrk, Collection.name, chain, version, transaction);
    }
    rmrkToObject(obj) {
        this.metadata = obj.metadata;
        this.name = obj.name;
        this.version = obj.version;
        // @ts-ignore
        const address = this.chain.getAddressClass();
        address.address = obj.issuer;
        const myChain = this.chain.constructor;
        // @ts-ignore
        this.contract = myChain.contractClass;
        // @ts-ignore
        this.contract.createContract(obj, this.chain, this);
        return this;
    }
    createCollectionFromInteraction() {
        const splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        // const datas = splitted[2].split(',');
        Entity_js_1.Entity.dataTreatment(splitted, this.collection);
        return this.rmrkToObject(this.collection);
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