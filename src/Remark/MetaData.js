"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaData = void 0;
const Entity_1 = require("./Entities/Entity");
const Jetski_1 = require("../Jetski/Jetski");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require('node-fetch');
class MetaData {
    constructor(url, data) {
        this.external_url = "";
        this.image = "";
        this.description = "";
        this.name = "";
        this.attributes = [];
        this.background_color = "";
        this.url = url;
        this.external_url = data.external_url;
        this.description = data.description != undefined ? Entity_1.Entity.slugification(data.description) : data.description;
        this.name = data.name != undefined ? Entity_1.Entity.slugification(data.name) : data.name;
        this.background_color = data.background_color;
        this.attributes = data.attributes;
        if (!data.image || data.image == "") {
            this.image = data.animation_url;
        }
        else {
            this.image = data.image;
        }
    }
    static getCorrectUrl(url, index) {
        // Modify the url for ipfs calls
        const shortUrl = this.getShortUrl(url);
        // Hack for only cloudflare url because Node.fetch don't like ipfs.io
        return MetaData.cloudFlareUrl + shortUrl;
        // if(urls.includes('ipfs')){
        //     if(index){
        //         return index % 2 === 0 ? this.ipfsUrl + shortUrl : this.cloudFlareUrl + shortUrl;
        //     }else{
        //         return this.ipfsUrl + shortUrl
        //     }
        // }else{
        //     return url;
        // }
    }
    static getShortUrl(longUrl) {
        return longUrl.split('/').pop();
    }
    static getCloudFlareUrl(url) {
        const urls = url.split('/');
        const shortUrl = urls.pop();
        if (urls.includes('ipfs')) {
            return MetaData.cloudFlareUrl + shortUrl;
        }
        else {
            return url;
        }
    }
    static async getMetaOnArray(interactions) {
        return new Promise(async (resolve, reject) => {
            let urls = [];
            let otherRemarks = [];
            for (const rmrk of interactions) {
                const entity = rmrk.getEntity();
                if (entity === null || entity === void 0 ? void 0 : entity.url) {
                    // Find if the meta's url has already been called
                    const shortUrl = this.getShortUrl(entity.url);
                    const found = Jetski_1.metaCalled.find(el => el.url == shortUrl);
                    if (found && found.meta) {
                        entity.addMetadata(found.meta);
                        otherRemarks.push(rmrk);
                    }
                    else {
                        urls.push(this.getCorrectUrl(entity.url));
                    }
                }
                else {
                    otherRemarks.push(rmrk);
                }
            }
            // fetch on URLs
            const responses = await this.callAllMeta(urls);
            let rmrksWithMeta = [];
            for (const response of responses) {
                if (response.ok) {
                    // attribute metadata to the good entity
                    rmrksWithMeta.push(this.refoundMetaObject(response, interactions));
                }
            }
            return Promise.all(rmrksWithMeta).then(remarks => {
                let allRemarks = otherRemarks.concat(remarks);
                resolve(allRemarks);
            }).catch(e => {
                reject(e);
            });
        });
    }
    static async refoundMetaObject(response, interactions) {
        return new Promise(async (resolve, reject) => {
            let data;
            response.json().then(r => {
                try {
                    // Try to create a MetadataInputs
                    data = r;
                }
                catch (e) {
                    // return empty object
                    console.error(e);
                    data = {
                        external_url: "",
                        image: "",
                        description: "",
                        name: "",
                        attributes: [],
                        background_color: "",
                        animation_url: ""
                    };
                }
                const responseUrl = this.getShortUrl(response.url);
                if (responseUrl) {
                    const interractionFound = interactions.find(rmrk => {
                        const entity = rmrk.getEntity();
                        if (entity) {
                            const entityUrl = this.getShortUrl(entity.url);
                            if (entityUrl)
                                return entityUrl == responseUrl;
                        }
                        return false;
                    });
                    if (interractionFound) {
                        const entity = interractionFound.getEntity();
                        const meta = new MetaData(response.url, data);
                        Jetski_1.metaCalled.push({ url: responseUrl, meta: meta });
                        if (entity) {
                            entity.addMetadata(meta);
                            resolve(interractionFound);
                        }
                    }
                }
            });
        });
    }
    static async callAllMeta(urls) {
        return new Promise(async (resolve, reject) => {
            let metaPromises = [];
            for (const url of urls) {
                metaPromises.push(fetch(url));
            }
            return Promise.all(metaPromises).then(result => {
                resolve(result);
            }).catch(e => {
                reject(e);
            });
        });
    }
    static async getMetaData(url, batchIndex) {
        let timeToWait = 100;
        // Use array index for increment the time out
        if (batchIndex && batchIndex != 0) {
            timeToWait = batchIndex * this.delayForCalls;
        }
        url = this.getCorrectUrl(url, batchIndex);
        console.log(url);
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            let response;
            setTimeout(() => {
                const metaAlreadyCalled = Jetski_1.metaCalled.find(meta => meta.url === url);
                if (metaAlreadyCalled && metaAlreadyCalled.meta) {
                    console.log("no call");
                    resolve(metaAlreadyCalled.meta);
                }
                let newMeta = undefined;
                request.open("GET", url);
                request.send();
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        try {
                            // Try to create a MetadataInputs with parsing
                            response = JSON.parse(this.responseText);
                        }
                        catch (e) {
                            // return empty object
                            response = {
                                external_url: "",
                                image: "",
                                description: "",
                                name: "",
                                attributes: [],
                                background_color: "",
                                animation_url: ""
                            };
                            console.error(e.message + "\n for the MetaData url : " + url);
                        }
                        newMeta = new MetaData(url, response);
                        const metaUrl = url.split("/").pop();
                        if (metaUrl) {
                            Jetski_1.metaCalled.push({
                                url: metaUrl,
                                meta: newMeta
                            });
                        }
                        resolve(newMeta);
                    }
                    else if (this.readyState == 4 && this.status == 404) {
                        reject('request : ' + this.status);
                    }
                    else if (this.readyState == 4 && this.status == 400) {
                        reject('Bad url : ' + url);
                    }
                    else if (this.readyState == 4 && this.status == 500) {
                        console.error(url);
                        reject('Something is bad with this request, error ' + this.status);
                    }
                };
            }, timeToWait);
        });
    }
}
exports.MetaData = MetaData;
MetaData.ipfsUrl = "https://ipfs.io/ipfs/";
MetaData.cloudFlareUrl = "https://cloudflare-ipfs.com/ipfs/";
MetaData.delayForCalls = 200;
//# sourceMappingURL=MetaData.js.map