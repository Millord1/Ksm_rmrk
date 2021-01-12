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
exports.List = void 0;
var Interaction_1 = require("../Interaction");
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(rmrk, chain, signer) {
        return _super.call(this, rmrk, List.name, chain, null, signer) || this;
    }
    List.prototype.createList = function () {
        var splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.nftId = this.nftFromComputedId(splitted[3]);
        this.quantity = splitted[4];
        return this;
    };
    List.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false);
        json['quantity'] = this.quantity;
        return JSON.stringify(json);
    };
    return List;
}(Interaction_1.Interaction));
exports.List = List;
//# sourceMappingURL=List.js.map