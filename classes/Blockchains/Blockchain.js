"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const KusamaAddress_js_1 = require("../Addresses/KusamaAddress.js");
const Polkadot_js_1 = require("./Polkadot.js");
const Unique_js_1 = require("./Unique.js");
const Kusama_js_1 = require("./Kusama.js");
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
    static getBlockchain(chain) {
        let blockchain;
        switch (chain) {
            case "polkadot":
                blockchain = new Polkadot_js_1.Polkadot();
                break;
            case "unique":
                // TODO remake Unique Blockchain
                //@ts-ignore
                blockchain = new Unique_js_1.Unique();
                break;
            case "kusama":
            default:
                blockchain = new Kusama_js_1.Kusama();
                break;
        }
        return blockchain;
    }
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map