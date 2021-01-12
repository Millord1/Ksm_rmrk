var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Entity } from "./Rmrk/Entity";
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(rmrk, chain, version, signer) {
        return _super.call(this, rmrk, Collection.name, chain, version, signer) || this;
    }
    Collection.prototype.rmrkToObject = function (obj) {
        this.metadata = obj.metadata;
        this.name = obj.name;
        this.version = obj.version;
        var address = this.chain.getAddressClass();
        address.address = obj.issuer;
        var myChain = this.chain.constructor;
        // @ts-ignore
        this.contract = myChain.contractClass;
        this.contract.createContract(obj, this.chain, this);
        return this;
    };
    Collection.prototype.createCollectionFromInteraction = function () {
        var splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        // const datas = splitted[2].split(',');
        Entity.dataTreatment(splitted, this.collection);
        return this.rmrkToObject(this.collection);
    };
    Collection.prototype.toJson = function (needStringify, needSubstrate) {
        if (needStringify === void 0) { needStringify = true; }
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
        json['chain'] = this.chain.toJson(needSubstrate);
        json['metadata'] = this.metadata;
        json['name'] = this.name;
        json['contract'] = this.contract;
        return (needStringify) ? JSON.stringify(json) : json;
    };
    return Collection;
}(Entity));
export { Collection };
