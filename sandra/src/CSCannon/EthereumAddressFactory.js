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
import { BlockchainAddressFactory } from "./BlockchainAddressFactory.js";
var EthereumAddressFactory = /** @class */ (function (_super) {
    __extends(EthereumAddressFactory, _super);
    function EthereumAddressFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.is_a = 'ethAddress';
        _this.contained_in_file = 'ethAddressFile';
        return _this;
    }
    return EthereumAddressFactory;
}(BlockchainAddressFactory));
export { EthereumAddressFactory };
