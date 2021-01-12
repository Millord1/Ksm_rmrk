var BlockchainContract = /** @class */ (function () {
    function BlockchainContract() {
    }
    BlockchainContract.prototype.createContract = function (obj, chain, collection) {
        this.chain = chain;
        this.collection = collection.name;
        this.version = obj.version;
        this.max = obj.max;
        this.symbol = obj.symbol;
        this.id = obj.id;
        this.issuer = (obj.issuer === null) ? null : this.chain.getAddressClass();
    };
    return BlockchainContract;
}());
export { BlockchainContract };