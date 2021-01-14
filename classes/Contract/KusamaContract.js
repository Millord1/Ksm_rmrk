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
exports.KusamaContract = void 0;
var BlockchainContract_js_1 = require("./BlockchainContract.js");
var KusamaContract = /** @class */ (function (_super) {
    __extends(KusamaContract, _super);
    function KusamaContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KusamaContract;
}(BlockchainContract_js_1.BlockchainContract));
exports.KusamaContract = KusamaContract;
//# sourceMappingURL=KusamaContract.js.map