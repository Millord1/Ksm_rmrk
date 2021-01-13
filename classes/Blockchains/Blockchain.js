"use strict";
exports.__esModule = true;
exports.Blockchain = void 0;
var Blockchain = /** @class */ (function () {
    function Blockchain(name, symbol, prefix, isSubstrate, wsProvider) {
        var _this = this;
        this.toJsonSerialize = function () { return ({
            name: _this.name,
            symbol: _this.symbol,
            prefix: _this.prefix,
            isSubstrate: _this.isSubstrate,
        }); };
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
    }
    return Blockchain;
}());
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map