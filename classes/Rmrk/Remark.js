"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remark = void 0;
class Remark {
    constructor(version, rmrk, chain, transaction) {
        this.rmrk = rmrk;
        this.chain = chain;
        if (version === null) {
            version = Remark.defaultVersion;
        }
        this.transaction = transaction;
        this.version = version;
    }
}
exports.Remark = Remark;
Remark.defaultVersion = '1.0.0';
Remark.entityObj = {
    version: "",
    name: "",
    max: 0,
    symbol: "",
    id: "",
    metadata: "",
    transferable: null,
    sn: "",
    collection: "",
    instance: ""
};
//# sourceMappingURL=Remark.js.map