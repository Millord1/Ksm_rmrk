"use strict";
exports.__esModule = true;
exports.Blockchain = void 0;
var Blockchain = /** @class */ (function () {
    function Blockchain(name, symbol, prefix, isSubstrate, addressClass) {
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.addressClass = addressClass;
    }
    Blockchain.prototype.getAddressClass = function () {
        return this.addressClass;
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map