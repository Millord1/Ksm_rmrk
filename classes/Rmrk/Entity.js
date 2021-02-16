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
const slugify = require('slugify');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
                        // const url = datas[2].slice(4);
                        // datas[2] = (protocol === "ipfs") ? protocol + '/' + url : protocol + url;
                        if (protocol === "ipfs") {
                            datas[2] = Entity.unicodeVerifier(datas[2].slice(4));
                        }
                        else {
                            datas[2] = datas[2];
                        }
                    }
                    datas[1] = datas[2];
                }
                else if (typeof datas[1] === 'string') {
                    datas[1] = Entity.unicodeVerifier(datas[1]);
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            });
        });
        return obj;
    }
    static unicodeVerifier(stringToScan) {
        // let isUnicode: boolean = false;
        //
        // for(let i = 0; i<stringToScan.length; i++){
        //     isUnicode = stringToScan.charCodeAt(i) > 255;
        // }
        return slugify(stringToScan, { replacement: ' ' });
    }
    static getMetaDataContent(urlIpfs) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let urlToCall = "";
                if (urlIpfs.includes('ipfs/')) {
                    urlIpfs = urlIpfs.replace('ipfs/', '');
                }
                urlToCall = "https://cloudflare-ipfs.com/ipfs/" + urlIpfs;
                console.log(urlToCall);
                const get = new XMLHttpRequest();
                let response;
                let metaData;
                get.open("GET", urlToCall);
                get.send();
                get.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        try {
                            response = JSON.parse(this.responseText);
                        }
                        catch (error) {
                            response = {
                                external_url: "",
                                image: "",
                                description: "",
                                name: "",
                                attributes: [],
                                background_color: "",
                            };
                            console.error(error.message + "\n for the MetaData url : " + urlToCall);
                        }
                        metaData = new Metadata_js_1.Metadata(urlToCall, response);
                        resolve(metaData);
                    }
                    else if (this.readyState == 4 && this.status == 404) {
                        reject('Bad request :' + this.status);
                    }
                    else if (this.readyState == 4 && this.status == 400) {
                        reject('Bad url : ' + urlToCall);
                    }
                };
            });
        });
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map