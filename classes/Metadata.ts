import {MetaDataInputs} from "./Interfaces.js";
import {Entity} from "./Rmrk/Entity.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export class Metadata
{

    public url: string;
    public external_url: string = "";
    public image: string = "";
    public description: string = "";
    public name: string = "";
    public attributes: Array<Object> = [];
    public background_color: string = "";

    private static delayForCalls: number = 500;


     constructor(url: string, meta: MetaDataInputs) {

         this.url = url;
         this.external_url = meta.external_url;
         this.image = meta.image;
         this.description = meta.description ? Entity.unicodeVerifier(meta.description) : meta.description;
         this.name = meta.name ? Entity.unicodeVerifier(meta.name) : meta.name;
         this.background_color = meta.background_color;
         this.attributes = meta.attributes;
    }


    public static async getMetaDataContent(metaUrl: string, batchIndex: number = 0): Promise<Metadata>
    {

        batchIndex = batchIndex > 0 ? batchIndex - 1 : batchIndex;

        const timeToWait: number = batchIndex * this.delayForCalls;

        return new Promise((resolve, reject) => {

            let urlToCall : string = "";

            if(metaUrl.includes('ipfs/')){

                metaUrl = metaUrl.replace('ipfs/','');

                // urlToCall = "https://cloudflare-ipfs.com/ipfs/" + metaUrl;
                urlToCall = "https://ipfs.io/ipfs/" + metaUrl;

            }else if(metaUrl.includes('https') || metaUrl.includes('http')){
                urlToCall = metaUrl;

            }else{
                metaUrl = metaUrl.replace('ipfs/','');
                // urlToCall = "https://cloudflare-ipfs.com/ipfs/" + metaUrl;
                urlToCall = "https://ipfs.io/ipfs/" + metaUrl;
            }

            const get = new XMLHttpRequest();

            let response: MetaDataInputs;
            let metaData : Metadata;

            setTimeout(()=>{

                get.open("GET", urlToCall);
                get.send();

                get.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        try{
                            response = JSON.parse(this.responseText);
                        }catch(error){

                            response = {
                                external_url : "",
                                image : "",
                                description : "",
                                name : "",
                                attributes : [],
                                background_color : "",
                            };
                            console.error(error.message + "\n for the MetaData url : " + urlToCall);
                        }

                        metaData = new Metadata(urlToCall, response);
                        resolve(metaData)

                    }else if(this.readyState == 4 && this.status == 404){
                        reject ('Bad request : ' + this.status + ' ' + urlToCall);
                    }else if(this.readyState == 4 && this.status == 400){
                        reject('Bad url : ' + urlToCall);
                    }
                }

            }, timeToWait)
        });

    }


}