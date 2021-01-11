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
exports.Kusama = void 0;
var SubstrateChain_1 = require("./SubstrateChain");
var KusamaAddress_1 = require("../Addresses/KusamaAddress");
var KusamaContract_1 = require("../Contract/KusamaContract");
var Kusama = /** @class */ (function (_super) {
    __extends(Kusama, _super);
    function Kusama() {
        var _this = _super.call(this, "Kusama", "KSM", "", true, new KusamaAddress_1.KusamaAddress()) || this;
        _this.wsProvider = 'wss://kusama-rpc.polkadot.io/';
        return _this;
    }
    Kusama.prototype.toJson = function (needSubstrate) {
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
        if (this.isSubstrate && needSubstrate) {
            json['substrateOf'] = this.substrateOf;
        }
        return json;
    };
    Kusama.contractClass = new KusamaContract_1.KusamaContract();
    return Kusama;
}(SubstrateChain_1.SubstrateChain));
exports.Kusama = Kusama;
//# sourceMappingURL=Kusama.js.map