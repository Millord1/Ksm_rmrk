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
exports.KusamaAddress = void 0;
var BlockchainAddress_js_1 = require("./BlockchainAddress.js");
var Kusama_js_1 = require("../Blockchains/Kusama.js");
var KusamaAddress = /** @class */ (function (_super) {
    __extends(KusamaAddress, _super);
    function KusamaAddress() {
        var _this = _super.call(this) || this;
        KusamaAddress.blockchain = new Kusama_js_1.Kusama();
        _this.blockchainName = KusamaAddress.blockchain.name;
        return _this;
    }
    return KusamaAddress;
}(BlockchainAddress_js_1.BlockchainAddress));
exports.KusamaAddress = KusamaAddress;
//# sourceMappingURL=KusamaAddress.js.map