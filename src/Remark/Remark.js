"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remark = void 0;
class Remark {
    constructor(rmrk, chain, version) {
        this.rmrk = rmrk;
        this.chain = chain;
        this.version = version === undefined || version === "undefined" ? Remark.actualVersion : version;
    }
}
exports.Remark = Remark;
Remark.actualVersion = '1.0.0';
//# sourceMappingURL=Remark.js.map