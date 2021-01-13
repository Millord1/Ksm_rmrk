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
import { Entity } from "./Rmrk/Entity.js";
import { BlockchainContract } from "./Contract/BlockchainContract.js";
var Nft = /** @class */ (function (_super) {
    __extends(Nft, _super);
    function Nft(rmrk, chain, version, signer) {
        return _super.call(this, rmrk, Nft.name, chain, version, signer) || this;
    }
    Nft.prototype.rmrkToObject = function (obj) {
        if (obj.contract instanceof BlockchainContract) {
            this.contract = obj.collection;
        }
        else {
            this.contractId = obj.collection;
        }
        this.name = obj.name;
        this.transferable = obj.transferable;
        this.sn = obj.sn;
        this.metadata = obj.metadata;
        if (typeof obj.issuer != 'undefined') {
            // @ts-ignore
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }
        return this;
    };
    Nft.prototype.createNftFromInteraction = function () {
        var splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        var nftDatas = splitted[2].split(',');
        Entity.dataTreatment(nftDatas, this.nft);
        return this.rmrkToObject(this.nft);
    };
    Nft.prototype.toJson = function (needStringify, needSubstrate) {
        if (needStringify === void 0) { needStringify = true; }
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);
        // @ts-ignore
        json['contractId'] = this.contractId;
        // @ts-ignore
        json['contract'] = this.contract;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['transferable'] = this.transferable;
        // @ts-ignore
        json['sn'] = this.sn;
        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['issuer'] = this.issuer;
        return (needStringify) ? JSON.stringify(json) : json;
    };
    return Nft;
}(Entity));
export { Nft };
