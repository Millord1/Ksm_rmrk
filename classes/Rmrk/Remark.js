"use strict";
exports.__esModule = true;
exports.Remark = void 0;
var Remark = /** @class */ (function () {
    function Remark(version, rmrk, chain, signer) {
        this.defaultVersion = '0.1';
        this.nft = {
            collection: null,
            name: null,
            sn: null,
            metadata: null,
            transferable: null
        };
        this.collection = {
            version: null,
            name: null,
            metadata: null,
            max: null,
            symbol: null,
            id: null,
            issuer: null,
        };
        this.rmrk = rmrk;
        this.chain = chain;
        if (version === null) {
            version = this.defaultVersion;
        }
        this.signer = signer;
        this.version = version;
    }
    return Remark;
}());
exports.Remark = Remark;
//# sourceMappingURL=Remark.js.map