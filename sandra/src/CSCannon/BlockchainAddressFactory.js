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
exports.BlockchainAddressFactory = void 0;
var EntityFactory_js_1 = require("../EntityFactory.js");
var BlockchainAddressFactory = /** @class */ (function (_super) {
    __extends(BlockchainAddressFactory, _super);
    function BlockchainAddressFactory(sandra) {
        var _this = _super.call(this, 'blockchainAddress', 'blockchainAddressFile', sandra) || this;
        _this.is_a = 'blockchainAddress';
        _this.contained_in_file = 'blockchainAddressFile';
        return _this;
    }
    BlockchainAddressFactory.prototype.getOrCreate = function (address) {
    };
    return BlockchainAddressFactory;
}(EntityFactory_js_1.EntityFactory));
exports.BlockchainAddressFactory = BlockchainAddressFactory;
//# sourceMappingURL=BlockchainAddressFactory.js.map