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
import { BlockchainContract } from "./Contract/BlockchainContract";
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
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }
        return this;
    };
    Nft.prototype.createNftFromInteraction = function () {
        var splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        var nftDatas = splitted[2].split(',');
        Entity.dataTreatment(nftDatas, this.nft);
        // nftDatas.forEach((data)=>{
        //     const datas = data.split(':');
        //
        //     if(datas.length > 2){
        //         if(datas[0] === 'metadata' && datas[1] === 'ipfs'){
        //             this.nft[datas[0]] = datas[1] + ':' + datas[2];
        //         }
        //     }else{
        //         this.nft[datas[0]] = datas[1];
        //     }
        //
        // });
        return this.rmrkToObject(this.nft);
    };
    Nft.prototype.toJson = function (needStringify, needSubstrate) {
        if (needStringify === void 0) { needStringify = true; }
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
        json['chain'] = this.chain.toJson(needSubstrate);
        json['contractId'] = this.contractId;
        json['contract'] = this.contract;
        json['name'] = this.name;
        json['transferable'] = this.transferable;
        json['sn'] = this.sn;
        json['metadata'] = this.metadata;
        json['issuer'] = this.issuer;
        return (needStringify) ? JSON.stringify(json) : json;
    };
    return Nft;
}(Entity));
export { Nft };
