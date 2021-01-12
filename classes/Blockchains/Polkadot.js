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
import { Blockchain } from "./Blockchain";
import { KusamaAddress } from "../Addresses/KusamaAddress";
import { PolkadotContract } from "../Contract/PolkadotContract";
var Polkadot = /** @class */ (function (_super) {
    __extends(Polkadot, _super);
    function Polkadot() {
        var _this = _super.call(this, "Polkadot", "DOT", "", false, KusamaAddress) || this;
        _this.wsProvider = 'wss://rpc.polkadot.io';
        return _this;
    }
    Polkadot.prototype.toJson = function () {
        return this.toJsonSerialize();
    };
    Polkadot.contractClass = PolkadotContract;
    return Polkadot;
}(Blockchain));
export { Polkadot };
