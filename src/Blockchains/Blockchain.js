"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
class Blockchain {
    constructor(symbol, prefix, isSubstrate, wsProvider, decimale) {
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
        this.decimale = decimale;
    }
    plancksToCrypto(value) {
        return value / Math.pow(10, this.decimale);
    }
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map