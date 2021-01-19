"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kusama = void 0;
const SubstrateChain_js_1 = require("./SubstrateChain.js");
const KusamaAddress_js_1 = require("../Addresses/KusamaAddress.js");
const KusamaContract_js_1 = require("../Contract/KusamaContract.js");
class Kusama extends SubstrateChain_js_1.SubstrateChain {
    constructor() {
        super("Kusama", "KSM", "", true, 'wss://kusama-rpc.polkadot.io/');
    }
    getAddressClass(address) {
        return new KusamaAddress_js_1.KusamaAddress(address);
    }
    toJson(needSubstrate = true) {
        const json = this.toJsonSerialize();
        if (this.isSubstrate && needSubstrate) {
            // @ts-ignore
            json['substrateOf'] = this.substrateOf;
        }
        return json;
    }
}
exports.Kusama = Kusama;
Kusama.contractClass = new KusamaContract_js_1.KusamaContract();
//# sourceMappingURL=Kusama.js.map