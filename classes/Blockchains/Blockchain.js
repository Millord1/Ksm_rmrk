var Blockchain = /** @class */ (function () {
    function Blockchain(name, symbol, prefix, isSubstrate, addressClass) {
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
        this.address = addressClass;
    }
    Blockchain.prototype.getAddressClass = function () {
        return this.address;
    };
    return Blockchain;
}());
export { Blockchain };
