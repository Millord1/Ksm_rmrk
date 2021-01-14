"use strict";
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
exports.__esModule = true;
exports.Asset = void 0;
var Entity_js_1 = require("./Rmrk/Entity.js");
var Token_js_1 = require("./Token.js");
var Asset = /** @class */ (function (_super) {
    __extends(Asset, _super);
    function Asset(rmrk, chain, version, signer) {
        return _super.call(this, rmrk, Asset.name, chain, version, signer) || this;
    }
    Asset.prototype.rmrkToObject = function (obj) {
        this.name = obj.name;
        this.metadata = obj.metadata;
        if (typeof obj.issuer != 'undefined') {
            // @ts-ignore
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }
        var token = new Token_js_1.Token(this.rmrk, this.chain, this.version, this.signer);
        this.token = token.setDatas(obj.transferable, obj.sn, obj.collection, this);
        return this;
    };
    Asset.prototype.createNftFromInteraction = function () {
        var splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        var nftDatas = splitted[2].split(',');
        Entity_js_1.Entity.dataTreatment(nftDatas, this.nft);
        return this.rmrkToObject(this.nft);
    };
    Asset.prototype.toJson = function (needStringify, needSubstrate) {
        if (needStringify === void 0) { needStringify = true; }
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
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
    };
    return Asset;
}(Entity_js_1.Entity));
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map