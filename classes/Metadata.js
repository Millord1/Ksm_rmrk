"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
class Metadata {
    constructor(url, meta) {
        this.external_url = "";
        this.image = "";
        this.description = "";
        this.name = "";
        this.attributes = [];
        this.background_color = "";
        this.url = url;
        this.external_url = meta.external_url;
        this.description = meta.description ? Entity_js_1.Entity.slugification(meta.description) : meta.description;
        this.name = meta.name ? Entity_js_1.Entity.slugification(meta.name) : meta.name;
        this.background_color = meta.background_color;
        this.attributes = meta.attributes;
        if (meta.image == "" || meta.image == undefined) {
            this.image = meta.animation_url;
        }
        else {
            this.image = meta.image;
        }
    }
    static async getMetaDataContent(metaUrl, batchIndex = 0) {
        batchIndex = batchIndex > 0 ? batchIndex - 1 : batchIndex;
        const timeToWait = batchIndex * this.delayForCalls;
        // if(batchIndex != 0){
        //     Global.lastCall = Date.now();
        // }
        return new Promise((resolve, reject) => {
            let urlToCall = "";
            if (metaUrl.includes('ipfs/')) {
                metaUrl = metaUrl.replace('ipfs/', '');
                // urlToCall = "https://cloudflare-ipfs.com/ipfs/" + metaUrl;
                urlToCall = "https://ipfs.io/ipfs/" + metaUrl;
            }
            else if (metaUrl.includes('https') || metaUrl.includes('http')) {
                urlToCall = metaUrl;
            }
            else {
                metaUrl = metaUrl.replace('ipfs/', '');
                // urlToCall = "https://cloudflare-ipfs.com/ipfs/" + metaUrl;
                urlToCall = "https://ipfs.io/ipfs/" + metaUrl;
            }
            console.log(urlToCall);
            const get = new XMLHttpRequest();
            let response;
            let metaData;
            setTimeout(() => {
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
                                animation_url: ""
                            };
                            console.error(error.message + "\n for the MetaData url : " + urlToCall);
                        }
                        metaData = new Metadata(urlToCall, response);
                        resolve(metaData);
                    }
                    else if (this.readyState == 4 && this.status == 404) {
                        reject('request : ' + this.status);
                    }
                    else if (this.readyState == 4 && this.status == 400) {
                        reject('Bad url : ' + urlToCall);
                    }
                };
            }, timeToWait);
        });
    }
}
exports.Metadata = Metadata;
Metadata.delayForCalls = 1000;
//# sourceMappingURL=Metadata.js.map