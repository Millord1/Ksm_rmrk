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
exports.Polkadot = void 0;
var Blockchain_1 = require("./Blockchain");
var KusamaAddress_1 = require("../Addresses/KusamaAddress");
var Polkadot = /** @class */ (function (_super) {
    __extends(Polkadot, _super);
    function Polkadot() {
        var _this = _super.call(this, "Polkadot", "DOT", "", false, KusamaAddress_1.KusamaAddress) || this;
        _this.wsProvider = 'wss://rpc.polkadot.io';
        return _this;
    }
    return Polkadot;
}(Blockchain_1.Blockchain));
exports.Polkadot = Polkadot;
//# sourceMappingURL=Polkadot.js.map