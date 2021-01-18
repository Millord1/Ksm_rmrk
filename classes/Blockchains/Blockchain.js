"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
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
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map