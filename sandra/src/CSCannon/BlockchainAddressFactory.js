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
var BlockchainAddress_js_1 = require("./BlockchainAddress.js");
var BlockchainAddressFactory = /** @class */ (function (_super) {
    __extends(BlockchainAddressFactory, _super);
    function BlockchainAddressFactory(sandra) {
        var _this = _super.call(this, 'blockchainAddress', 'blockchainAddressFile', sandra) || this;
        _this.is_a = 'blockchainAddress';
        _this.contained_in_file = 'blockchainAddressFile';
        _this.sandra = sandra;
        return _this;
    }
    BlockchainAddressFactory.prototype.getOrCreate = function (address) {
        if (this.entityByRevValMap.has(this.sandra.get('address'))) {
            var addressRefMap = this.entityByRevValMap.get(this.sandra.get('address'));
            if (addressRefMap.has(address)) {
                //address exists in factory
                return addressRefMap.get(address)[0];
            }
        }
        return new BlockchainAddress_js_1.BlockchainAddress(this, address, this.sandra);
    };
    return BlockchainAddressFactory;
}(EntityFactory_js_1.EntityFactory));
exports.BlockchainAddressFactory = BlockchainAddressFactory;
//# sourceMappingURL=BlockchainAddressFactory.js.map