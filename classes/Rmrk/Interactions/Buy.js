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
exports.Buy = void 0;
var Interaction_1 = require("../Interaction");
var Buy = /** @class */ (function (_super) {
    __extends(Buy, _super);
    function Buy(rmrk, chain) {
        return _super.call(this, rmrk, Buy.name, chain, null) || this;
    }
    Buy.prototype.createBuy = function () {
        var splitted = this.rmrkToArray();
        this.nftId = this.nftFromComputedId(splitted[3]);
        return this;
    };
    Buy.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    };
    return Buy;
}(Interaction_1.Interaction));
exports.Buy = Buy;
//# sourceMappingURL=Buy.js.map