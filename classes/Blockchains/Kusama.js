"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kusama = void 0;
const SubstrateChain_js_1 = require("./SubstrateChain.js");
class Kusama extends SubstrateChain_js_1.SubstrateChain {
    constructor() {
        super("Kusama", "KSM", "", true, 'wss://kusama-rpc.polkadot.io/');
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
//# sourceMappingURL=Kusama.js.map