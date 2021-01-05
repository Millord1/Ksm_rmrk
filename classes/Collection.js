"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Collection = void 0;
var Entity_1 = require("./Rmrk/Entity");
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(rmrk, chain, version) {
        return _super.call(this, rmrk, Collection.name, chain, version) || this;
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
        var _this = this;
        var splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        var datas = splitted[2].split(',');
        datas.forEach(function (index) {
            index = index.replace(/[&\/\\+_-]/g, ' ');
            var datas = index.split(':');
            if (datas.length > 2) {
                if (datas[0] === 'metadata') {
                    _this.collection[datas[0]] = datas[1] + ':' + datas[2];
                }
            }
            else {
                _this.collection[datas[0]] = datas[1];
            }
        });
        return this.rmrkToObject(this.collection);
    };
    Collection.prototype.toJson = function (needStringify) {
        if (needStringify === void 0) { needStringify = true; }
        var json = this.toJsonSerialize();
        json['chain'] = this.chain.toJson(needStringify);
        json['metadata'] = this.metadata;
        json['name'] = this.name;
        json['contract'] = this.contract;
        return (needStringify) ? JSON.stringify(json) : json;
    };
    return Collection;
}(Entity_1.Entity));
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map