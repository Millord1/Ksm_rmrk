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
import { SubstrateChain } from "./SubstrateChain.js";
import { KusamaAddress } from "../Addresses/KusamaAddress.js";
import { KusamaContract } from "../Contract/KusamaContract.js";
var Kusama = /** @class */ (function (_super) {
    __extends(Kusama, _super);
    function Kusama() {
        return _super.call(this, "Kusama", "KSM", "", true, new KusamaAddress(), 'wss://kusama-rpc.polkadot.io/') || this;
    }
    Kusama.prototype.toJson = function (needSubstrate) {
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
        if (this.isSubstrate && needSubstrate) {
            // @ts-ignore
            json['substrateOf'] = this.substrateOf;
        }
        return json;
    };
    Kusama.contractClass = new KusamaContract();
    return Kusama;
}(SubstrateChain));
export { Kusama };
