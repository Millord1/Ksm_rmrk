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
var Nft = /** @class */ (function (_super) {
    __extends(Nft, _super);
    function Nft(rmrk, chain, version) {
        return _super.call(this, rmrk, Nft.constructor.name, chain, version) || this;
    }
    Nft.prototype.rmrkToObject = function (obj) {
        this.collection = obj.collection;
        this.name = obj.name;
        this.transferable = obj.transferable;
        this.sn = obj.sn;
        this.metadata = obj.metadata;
        if (typeof obj.issuer != 'undefined') {
            this.issuer = (obj.issuer === null) ? null : this.collection.chain.getAddressClass();
        }
        return this;
    };
    return Nft;
}(Entity_1.Entity));
exports.Nft = Nft;
//# sourceMappingURL=Nft.js.map