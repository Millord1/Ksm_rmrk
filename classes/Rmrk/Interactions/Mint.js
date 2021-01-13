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
var Interaction_js_1 = require("../Interaction.js");
var Collection_js_1 = require("../../Collection.js");
var Mint = /** @class */ (function (_super) {
    __extends(Mint, _super);
    function Mint(rmrk, chain, signer) {
        var _this = _super.call(this, rmrk, Mint.name, chain, null, signer) || this;
        //@ts-ignore
        var myCollection = new Collection_js_1.Collection(_this.rmrk, _this.chain, null, _this.signer.address);
        _this.myCollection = myCollection.createCollectionFromInteraction();
        return _this;
    }
    // public createMint(){
    //     //@ts-ignore
    //     const myCollection = new Collection(this.rmrk, this.chain, null, this.signer.address);
    //     this.myCollection = myCollection.createCollectionFromInteraction();
    //     return this;
    // }
    Mint.prototype.toJson = function () {
        var json = this.myCollection.toJson(false);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    };
    return Mint;
}(Interaction_js_1.Interaction));
exports.Mint = Mint;
//# sourceMappingURL=Mint.js.map