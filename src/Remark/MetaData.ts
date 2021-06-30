import {Entity} from "./Entities/Entity";
import {metaCalled} from "../Jetski/Jetski";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


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
    private static delayForCalls: number = 500;

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

        const urls: Array<string> = url.split('/');
        const shortUrl = urls.pop();

        if(urls.includes('ipfs')){
            if(index){
                // Hack for avoid server saturation
                return index % 2 === 0 ? this.ipfsUrl + shortUrl : this.cloudFlareUrl + shortUrl;
            }else{
                return this.ipfsUrl + shortUrl
            }
        }else{
            return url;
        }

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