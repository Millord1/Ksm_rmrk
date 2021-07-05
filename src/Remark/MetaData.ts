import {Entity} from "./Entities/Entity";
import {metaCalled} from "../Jetski/Jetski";
import {Interaction} from "./Interactions/Interaction";
import {Mint} from "./Interactions/Mint";
import {MintNft} from "./Interactions/MintNft";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require('node-fetch');


interface MetadataInputs
{
    external_url: string;
    image: string;
    description: string;
    name: string;
    attributes: Array<Object>;
    background_color: string;
    animation_url: string;
}

export class MetaData
{

    public url: string;
    public external_url: string = "";
    public image: string = "";
    public description: string = "";
    public name: string = "";
    public attributes: Array<Object> = [];
    public background_color: string = "";

    private static ipfsUrl: string = "https://ipfs.io/ipfs/";
    private static cloudFlareUrl: string = "https://cloudflare-ipfs.com/ipfs/";
    private static delayForCalls: number = 200;

    constructor(url: string, data: MetadataInputs) {
        this.url = url;
        this.external_url = data.external_url;
        this.description = data.description != undefined ? Entity.slugification(data.description) : data.description;
        this.name = data.name != undefined ? Entity.slugification(data.name) : data.name;
        this.background_color = data.background_color;
        this.attributes = data.attributes;
        
        if(!data.image || data.image == ""){
            this.image = data.animation_url;
        }else{
            this.image = data.image;
        }
    }


    private static getCorrectUrl(url: string, index?: number): string
    {
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


    private static getShortUrl(longUrl: string)
    {
        return longUrl.split('/').pop();
    }



    public static getCloudFlareUrl(url: string): string
    {
        const urls: Array<string> = url.split('/');
        const shortUrl = urls.pop();

        if(urls.includes('ipfs')){
            return MetaData.cloudFlareUrl + shortUrl;
        }else{
            return url;
        }
    }


    public static async getMetaOnArray(interactions: Array<Mint|MintNft>): Promise<Array<Interaction>>
    {
        return new Promise(async (resolve, reject)=>{

            let urls: Array<string> = [];
            let otherRemarks: Array<Interaction> = [];

            for(const rmrk of interactions){
                const entity: Entity|undefined = rmrk.getEntity();
                if(entity?.url){

                    // Find if the meta's url has already been called
                    const shortUrl = this.getShortUrl(entity.url);
                    const found = metaCalled.find(el => el.url == shortUrl);

                    if(found && found.meta){
                        entity.addMetadata(found.meta);
                        otherRemarks.push(rmrk);
                    }else{
                        urls.push(this.getCorrectUrl(entity.url));
                    }

                }else{
                    otherRemarks.push(rmrk);
                }
            }

            // fetch on URLs
            const responses: Array<Response> = await this.callAllMeta(urls);

            let rmrksWithMeta: Array<Promise<Mint|MintNft>> = [];

            for(const response of responses){
                if(response.ok){
                    // attribute metadata to the good entity
                    rmrksWithMeta.push(this.refoundMetaObject(response, interactions));
                }
            }

            return Promise.all(rmrksWithMeta).then(remarks=>{
                let allRemarks : Array<Interaction> = otherRemarks.concat(remarks)
                resolve(allRemarks);
            }).catch(e=>{
                reject(e);
            })
        })

    }


    public static async refoundMetaObject(response: Response, interactions: Array<MintNft|Mint>): Promise<Mint|MintNft>
    {

        return new Promise(async (resolve, reject)=>{

            let data: MetadataInputs;

            response.json().then(r=>{
                try{
                    // Try to create a MetadataInputs
                    data = r;
                }catch(e){
                    // return empty object
                    console.error(e);
                    data = {
                        external_url : "",
                        image : "",
                        description : "",
                        name : "",
                        attributes : [],
                        background_color : "",
                        animation_url : ""
                    };
                }

                const responseUrl = this.getShortUrl(response.url);

                if(responseUrl){
                    const interractionFound = interactions.find( rmrk =>{
                        const entity: Entity|undefined = rmrk.getEntity();
                        if(entity){
                            const entityUrl = this.getShortUrl(entity.url);
                            if(entityUrl) return entityUrl == responseUrl;
                        }
                        return false;
                    })

                    if(interractionFound){
                        const entity: Entity|undefined = interractionFound.getEntity();
                        const meta = new MetaData(response.url, data);
                        metaCalled.push({url: responseUrl, meta: meta});
                        if(entity){
                            entity.addMetadata(meta);
                            resolve (interractionFound);
                        }
                    }
                }


                // for(const rmrk of interactions){
                //
                //     let entity: Entity|undefined = rmrk instanceof Mint ? rmrk.collection : rmrk.asset;
                //
                //     if(entity){
                //         const shortUrl = response.url.split('/').pop();
                //         const entityUrl = entity?.url.split('/').pop();
                //
                //         if(entityUrl && shortUrl){
                //             if(entityUrl == shortUrl){
                //                 const meta = new MetaData(response.url, data);
                //                 metaCalled.push({url: shortUrl, meta: meta});
                //                 entity.addMetadata(meta);
                //             }
                //             resolve (rmrk);
                //         }
                //     }
                //
                // }
            })

        })

    }


    public static async callAllMeta(urls: Array<string>): Promise<Array<Response>>
    {
        return new Promise(async (resolve, reject)=>{
            let metaPromises: Array<Promise<Response>> = [];

            for(const url of urls){
                metaPromises.push(fetch(url));
            }

            return Promise.all(metaPromises).then(result=>{
                resolve(result);
            }).catch(e=>{
                reject(e);
            })
        })
    }


    public static async getMetaData(url: string, batchIndex?: number): Promise<MetaData>
    {

        let timeToWait: number = 100;
        // Use array index for increment the time out

        if(batchIndex && batchIndex != 0){
            timeToWait = batchIndex * this.delayForCalls;
        }

        url = this.getCorrectUrl(url, batchIndex);

        console.log(url);

        return new Promise((resolve, reject)=>{

            const request = new XMLHttpRequest();
            let response: MetadataInputs;

            setTimeout(()=>{

                const metaAlreadyCalled = metaCalled.find(meta => meta.url === url);

                if(metaAlreadyCalled && metaAlreadyCalled.meta){
                    console.log("no call");
                    resolve (metaAlreadyCalled.meta);
                }

                let newMeta: MetaData|undefined = undefined;

                request.open("GET", url);
                request.send();

                request.onreadystatechange = function(){

                    if(this.readyState == 4 && this.status == 200){

                        try{
                            // Try to create a MetadataInputs with parsing
                            response = JSON.parse(this.responseText);

                        }catch(e){
                            // return empty object
                            response = {
                                external_url : "",
                                image : "",
                                description : "",
                                name : "",
                                attributes : [],
                                background_color : "",
                                animation_url : ""
                            };
                            console.error(e.message + "\n for the MetaData url : " + url);
                        }

                        newMeta = new MetaData(url, response);
                        const metaUrl = url.split("/").pop();

                        if(metaUrl){
                            metaCalled.push({
                                url: metaUrl,
                                meta: newMeta
                            })
                        }
                        resolve (newMeta);

                    }else if(this.readyState == 4 && this.status == 404){
                        reject ('request : ' + this.status);
                    }else if(this.readyState == 4 && this.status == 400){
                        reject('Bad url : ' + url);
                    }else if(this.readyState == 4 && this.status == 500){
                        console.error(url);
                        reject('Something is bad with this request, error ' + this.status);
                    }

                }

            }, timeToWait)

        })

    }


}