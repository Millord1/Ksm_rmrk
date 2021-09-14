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
            this.image = MetaData.getCorrectUrl(data.image);
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
        // const splittedUrl = longUrl.split("/");
        return longUrl.split('//').pop();
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
                    urls.push(this.getCorrectUrl(entity.url));
                }
                else {
                    otherRemarks.push(rmrk);
                }
            }
            // fetch on URLs
            const responses = await this.callAllMeta(urls);
            for (const response of responses) {
                const responseUrl = this.getShortUrl(response.url);
                for (const interaction of interactions) {
                    const entity = interaction.getEntity();
                    if (entity === null || entity === void 0 ? void 0 : entity.url) {
                        const shortUrl = this.getShortUrl(entity === null || entity === void 0 ? void 0 : entity.url);
                        if (shortUrl && (responseUrl === null || responseUrl === void 0 ? void 0 : responseUrl.includes(shortUrl)) || responseUrl == shortUrl) {
                            entity.addMetadata(response.meta);
                        }
                    }
                }
            }
            let allRemarks = otherRemarks.concat(interactions);
            resolve(allRemarks);
        });
    }
    static async refoundMetaObject(responses, interactions) {
        // return new Promise(async (resolve, reject)=>{
        const interactionsWithMeta = [];
        for (const response of responses) {
            for (const interaction of interactions) {
                const entity = interaction.getEntity();
                if ((entity === null || entity === void 0 ? void 0 : entity.url) && entity.url == response.url) {
                    entity.addMetadata(response.meta);
                }
            }
        }
        return interactionsWithMeta;
        // if(interactionsWithMeta.length == interactions.length){
        //     console.log(interactionsWithMeta);
        //     // resolve(interactionsWithMeta);
        //     return interactionsWithMeta;
        // }
        // let data: MetadataInputs;
        // response.meta.json().then((r: MetadataInputs)=>{
        //     try{
        //         // Try to create a MetadataInputs
        //         data = r;
        //     }catch(e){
        //         // return empty object
        //         console.error(e);
        //         data = {
        //             external_url : "",
        //             image : "",
        //             description : "",
        //             name : "",
        //             attributes : [],
        //             background_color : "",
        //             animation_url : ""
        //         };
        //     }
        // const responseUrl = this.getShortUrl(response.url);
        // if(responseUrl){
        //     const interactionFound = interactions.find( rmrk =>{
        //         const entity: Entity|undefined = rmrk.getEntity();
        //
        //         if(entity && !entityFound.includes(entity)){
        //             const entityUrl = this.getShortUrl(entity.url);
        //             if(entityUrl) return entityUrl == responseUrl;
        //         }
        //         return false;
        //     })
        //
        //     if(interactionFound){
        //         const entity: Entity|undefined = interactionFound.getEntity();
        //         const meta = new MetaData(response.meta.url, data);
        //         // metaCalled.push({url: responseUrl, meta: meta});
        //
        //         if(entity){
        //             entityFound.push(entity);
        //             entity.addMetadata(meta);
        //             resolve (interactionFound);
        //         }
        //     }
        // }
        // })
        // })
    }
    static async callAllMeta(urls) {
        return new Promise(async (resolve, reject) => {
            // let metaPromises: Array<Promise<Response>> = [];
            for (const url of urls) {
                const found = Jetski_1.metaCalled.find(el => el.url == url);
                if (!found) {
                    // metaPromises.push(fetch(url));
                    try {
                        console.log("Waiting 100ms to fetch: " + url);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const response = await fetch(url);
                        console.log("Fetched: " + url);
                        if (response.ok) {
                            const jsonResponse = await response.json();
                            const meta = new MetaData(url, jsonResponse);
                            Jetski_1.metaCalled.push({ url: url, meta: meta });
                        }
                    }
                    catch (err) {
                        // @ts-ignore
                        console.error(err.name + " : " + err.url);
                    }
                }
            }
            resolve(Jetski_1.metaCalled);
            // return Promise.all(metaPromises).then(result=>{
            //     resolve(result);
            // }).catch(e=>{
            //     reject(e);
            // })
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
                            // @ts-ignore
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
MetaData.ipfsUrl = "https://ipfs.io/";
MetaData.cloudFlareUrl = "https://cloudflare-ipfs.com/";
MetaData.delayForCalls = 200;
//# sourceMappingURL=MetaData.js.map