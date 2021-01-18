"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Remark_js_1 = require("./Remark.js");
class Entity extends Remark_js_1.Remark {
    constructor(rmrk, standard, chain, version, signer) {
        super(version, rmrk, chain, signer);
        this.toJsonSerialize = () => ({
            version: this.version,
            rmrk: this.rmrk,
            chain: this.chain,
            standard: this.standard
        });
        this.standard = standard;
    }
    static dataTreatment(splitted, obj) {
        splitted.forEach((index) => {
            const splittedDatas = index.split(',');
            for (let i = 0; i < splittedDatas.length; i++) {
                splittedDatas[i] = splittedDatas[i].replace(/[&\/\\"']/g, '');
            }
            if (splittedDatas.length > 2) {
                splittedDatas.forEach((split) => {
                    const datas = split.split(':');
                    if (datas[0] === "metadata") {
                        const ipfs = datas[2].slice(0, 4);
                        if (datas[1] === "ipfs") {
                            const url = datas[2].slice(4);
                            datas[2] = (ipfs === "ipfs") ? ipfs + '/' + url : ipfs + url;
                        }
                        const separator = (ipfs === "ipfs") ? '://' : ':';
                        datas[1] = datas[1] + separator + datas[2];
                    }
                    // @ts-ignore
                    obj[datas[0]] = datas[1];
                });
            }
        });
        return obj;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map