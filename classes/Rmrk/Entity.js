"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Remark_js_1 = require("./Remark.js");
const slugify = require('slugify');
class Entity extends Remark_js_1.Remark {
    constructor(rmrk, standard, chain, version, transaction, meta) {
        super(version, rmrk, chain, transaction);
        this.toJsonSerialize = () => ({
            version: this.version,
            rmrk: this.rmrk,
            chain: this.chain,
            standard: this.standard
        });
        this.standard = standard;
        this.metaDataContent = meta;
    }
    static dataTreatment(splitted, obj) {
        splitted.forEach((index) => {
            const splittedDatas = index.split(',');
            for (let i = 0; i < splittedDatas.length; i++) {
                splittedDatas[i] = splittedDatas[i].replace(/[&\/\\"']/g, '');
            }
            splittedDatas.forEach((split) => {
                const datas = split.split(':');
                if (datas[0] === "metadata") {
                    const protocol = datas[2].slice(0, 4);
                    if (datas[1] === "ipfs") {
                        if (protocol === "ipfs") {
                            datas[2] = Entity.slugification(datas[2].slice(4));
                        }
                        else {
                            datas[2] = datas[2];
                        }
                    }
                    datas[1] = datas[2];
                }
                else if (typeof datas[1] === 'string') {
                    datas[1] = Entity.slugification(datas[1]);
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            });
        });
        return obj;
    }
    static slugification(stringToScan) {
        // let isUnicode: boolean = false;
        //
        // for(let i = 0; i<stringToScan.length; i++){
        //     isUnicode = stringToScan.charCodeAt(i) > 255;
        // }
        return slugify(stringToScan, { replacement: ' ' });
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map