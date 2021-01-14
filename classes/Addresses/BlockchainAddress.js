var BlockchainAddress = /** @class */ (function () {
    function BlockchainAddress() {
    }
    BlockchainAddress.prototype.toJson = function () {
        return { blockchainName: this.blockchainName };
    };
    return BlockchainAddress;
}());
export { BlockchainAddress };
