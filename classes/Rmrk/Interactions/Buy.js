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
exports.Buy = void 0;
var Interaction_js_1 = require("../Interaction.js");
var Buy = /** @class */ (function (_super) {
    __extends(Buy, _super);
    function Buy(rmrk, chain, signer) {
        var _this = _super.call(this, rmrk, Buy.name, chain, null, signer) || this;
        var splitted = _this.rmrkToArray();
        _this.nftId = _this.nftFromComputedId(splitted[3]);
        return _this;
    }
    // public createBuy(){
    //     const splitted = this.rmrkToArray();
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //     return this;
    // }
    Buy.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    };
    return Buy;
}(Interaction_js_1.Interaction));
exports.Buy = Buy;
//# sourceMappingURL=Buy.js.map