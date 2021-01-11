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
exports.Mint = void 0;
var Interaction_1 = require("../Interaction");
var Collection_1 = require("../../Collection");
var Mint = /** @class */ (function (_super) {
    __extends(Mint, _super);
    function Mint(rmrk, chain) {
        return _super.call(this, rmrk, Mint.name, chain, null) || this;
    }
    Mint.prototype.createMint = function () {
        var myCollection = new Collection_1.Collection(this.rmrk, this.chain, null);
        this.myCollection = myCollection.createCollectionFromInteraction();
        return this;
    };
    Mint.prototype.toJson = function () {
        var json = this.myCollection.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    };
    return Mint;
}(Interaction_1.Interaction));
exports.Mint = Mint;
//# sourceMappingURL=Mint.js.map