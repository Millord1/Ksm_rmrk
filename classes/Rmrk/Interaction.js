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
exports.Interaction = void 0;
var Remark_1 = require("./Remark");
var Nft_1 = require("../Nft");
var Interaction = /** @class */ (function (_super) {
    __extends(Interaction, _super);
    function Interaction(rmrk, interaction, chain, version, signer) {
        var _this = _super.call(this, version, rmrk, chain, signer) || this;
        _this.toJsonSerialize = function () { return ({
            version: _this.version,
            rmrk: _this.rmrk,
            chain: _this.chain.toJson(),
            interaction: _this.interaction
        }); };
        _this.interaction = interaction;
        return _this;
    }
    Interaction.prototype.rmrkToArray = function () {
        return this.rmrk.split('::');
    };
    Interaction.prototype.nftFromComputedId = function (computed) {
        var nftDatas = this.checkDatasLength(computed.split('-'), 3);
        this.nft.collection = nftDatas[0];
        this.nft.name = nftDatas[1];
        this.nft.sn = nftDatas[2];
        // @ts-ignore
        var nft = new Nft_1.Nft(this.rmrk, this.chain, this.version, this.signer.address);
        return nft.rmrkToObject(this.nft);
    };
    Interaction.prototype.checkDatasLength = function (datas, length) {
        if (datas.length > length) {
            var name_1 = datas[0] + '-' + datas[1];
            datas.splice(0, 2);
            var sn = datas[datas.length - 1];
            var isNumber = true;
            for (var i = 0; i < sn.length; i++) {
                if (isNaN(parseInt(sn[i]))) {
                    isNumber = false;
                }
            }
            if (isNumber) {
                var serialN = sn;
                datas.pop();
                var nftName = '';
                for (var i = 0; i < datas.length; i++) {
                    var first = (i === 0) ? '' : '-';
                    nftName += first + datas[i];
                }
                datas = [];
                datas.unshift(serialN);
                datas.unshift(nftName);
                datas.unshift(name_1);
            }
        }
        return datas;
    };
    return Interaction;
}(Remark_1.Remark));
exports.Interaction = Interaction;
//# sourceMappingURL=Interaction.js.map