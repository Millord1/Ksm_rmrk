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
import { EntityFactory } from "../EntityFactory.js";
var BlockchainContractFactory = /** @class */ (function (_super) {
    __extends(BlockchainContractFactory, _super);
    function BlockchainContractFactory(sandra) {
        var _this = _super.call(this, 'blockchainContract', 'blockchainContractFile', sandra) || this;
        _this.contained_in_file = 'blockchainContractFile';
        return _this;
    }
    return BlockchainContractFactory;
}(EntityFactory));
export { BlockchainContractFactory };
