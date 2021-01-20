"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const KusamaAddress_js_1 = require("../Addresses/KusamaAddress.js");
class Blockchain {
    constructor(name, symbol, prefix, isSubstrate, wsProvider) {
        this.toJsonSerialize = () => ({
            name: this.name,
            symbol: this.symbol,
            prefix: this.prefix,
            isSubstrate: this.isSubstrate,
        });
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
    }
    getAddressClass(address) {
        switch (this.name.toLowerCase()) {
            case 'kusama':
            default:
                return new KusamaAddress_js_1.KusamaAddress(address);
        }
    }
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map