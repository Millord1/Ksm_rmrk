"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Remark_js_1 = require("./Remark.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
            splittedDatas.forEach((split) => {
                const datas = split.split(':');
                if (datas[0] === "metadata") {
                    const ipfs = datas[2].slice(0, 4);
                    if (datas[1] === "ipfs") {
                        const url = datas[2].slice(4);
                        datas[2] = (ipfs === "ipfs") ? ipfs + '/' + url : ipfs + url;
                    }
                    datas[1] = datas[2];
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            });
        });
        return obj;
    }
    getMetadatasContent() {
        // TODO complete with real ipfs metadatas link
        // const url = "ipfs.io/ipfs/QmSkmCWNBoMGyd1d1TzQpgAakRCux5JAqQpRjDSNiv3DDB";
        const url = "ipfs.io/ipfs/QmcQpkNDoYbFPbwPUAaS2ACnKpBib1z6VWDGD1qFtYvfdZ";
        const get = new XMLHttpRequest();
        get.open("GET", 'https://' + url);
        const response = get.response;
        // const jason = JSON.parse(response);
        console.log(response);
        // this.getIpfsMetaDatas(ipfs);
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map