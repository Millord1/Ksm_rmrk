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

    private static delayForCalls: number = 1000;


     constructor(url: string, meta: MetaDataInputs) {

         this.url = url;
         this.external_url = meta.external_url;
         this.description = meta.description ? Entity.slugification(meta.description) : meta.description;
         this.name = meta.name ? Entity.slugification(meta.name) : meta.name;
         this.background_color = meta.background_color;
         this.attributes = meta.attributes;

         if(meta.image == "" || meta.image == undefined){
             this.image = meta.animation_url;
         }else{
             this.image = meta.image
         }
    }




    public static async getMetaDataContent(metaUrl: string, batchIndex: number = 0): Promise<Metadata>
    {

        batchIndex = batchIndex > 0 ? batchIndex - 1 : batchIndex;

        const timeToWait: number = batchIndex * this.delayForCalls;

        // if(batchIndex != 0){
        //     Global.lastCall = Date.now();
        // }


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
            console.log(urlToCall);
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
                                animation_url: ""
                            };
                            console.error(error.message + "\n for the MetaData url : " + urlToCall);
                        }

                        metaData = new Metadata(urlToCall, response);
                        resolve(metaData)

                    }else if(this.readyState == 4 && this.status == 404){
                        reject ('request : ' + this.status);
                    }else if(this.readyState == 4 && this.status == 400){
                        reject('Bad url : ' + urlToCall);
                    }
                }

            }, timeToWait)
        });

    }


}