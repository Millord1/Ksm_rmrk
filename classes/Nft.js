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
exports.Nft = void 0;
var Entity_1 = require("./Rmrk/Entity");
var BlockchainContract_1 = require("./Contract/BlockchainContract");
var Nft = /** @class */ (function (_super) {
    __extends(Nft, _super);
    function Nft(rmrk, chain, version) {
        return _super.call(this, rmrk, Nft.constructor.name, chain, version) || this;
    }
    Nft.prototype.rmrkToObject = function (obj) {
        if (obj.contract instanceof BlockchainContract_1.BlockchainContract) {
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
        var _this = this;
        var splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        var nftDatas = splitted[2].split(',');
        nftDatas.forEach(function (data) {
            var datas = data.split(':');
            if (datas.length > 2) {
                if (datas[0] === 'metadata' && datas[1] === 'ipfs') {
                    _this.nft[datas[0]] = datas[1] + ':' + datas[2];
                }
            }
            else {
                _this.nft[datas[0]] = datas[1];
            }
        });
        return this.rmrkToObject(this.nft);
    };
    return Nft;
}(Entity_1.Entity));
exports.Nft = Nft;
//# sourceMappingURL=Nft.js.map