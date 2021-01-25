"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Remark_js_1 = require("./Remark.js");
const Metadata_js_1 = require("../Metadata.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
class Entity extends Remark_js_1.Remark {
    constructor(rmrk, standard, chain, version, transaction, url) {
        super(version, rmrk, chain, transaction);
        this.toJsonSerialize = () => ({
            version: this.version,
            rmrk: this.rmrk,
            chain: this.chain,
            standard: this.standard
        });
        this.standard = standard;
        this.url = url;
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
                        const url = datas[2].slice(4);
                        datas[2] = (protocol === "ipfs") ? protocol + '/' + url : protocol + url;
                    }
                    datas[1] = datas[2];
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            });
        });
        return obj;
    }
    // public async getMeta(){
    //     this.metaData = await this.getMetaDataContent(this.url);
    // }
    static getMetaData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // const urlToCall = 'ipfs.io/' + url;
            const urlToCall = 'ipfs.io/ipfs/QmavoTVbVHnGEUztnBT2p3rif3qBPeCfyyUE5v4Z7oFvs4';
            const get = new XMLHttpRequest();
            console.log(urlToCall);
            let response;
            get.open("GET", 'https://' + urlToCall);
            get.send();
            get.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    response = JSON.parse(this.responseText);
                    // console.log(this.responseText);
                    return new Metadata_js_1.Metadata(urlToCall, response);
                    ;
                }
            };
        });
    }
    static getMetaDataContent(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const urlToCall = 'ipfs.io/' + url;
                const get = new XMLHttpRequest();
                console.log(urlToCall);
                let response;
                let metaData;
                get.open("GET", 'https://' + urlToCall);
                get.send();
                get.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        response = JSON.parse(this.responseText);
                        metaData = new Metadata_js_1.Metadata(urlToCall, response);
                        resolve(metaData);
                    }
                    else {
                        reject("call doesn't work");
                    }
                };
            });
        });
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map