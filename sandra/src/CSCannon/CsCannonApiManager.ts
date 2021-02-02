import {CSCanonizeManager} from "./CSCanonizeManager";
import {ApiConnector} from "../Gossiper";
import {AssetCollection, AssetCollectionInterface} from "./AssetCollection";

let XMLHttpRequest:any = null ;

let nodeXMLHttp = false ;

try {
     XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}catch (e){
    console.log(e)
}

export class CsCannonApiManager {
    private canonize: CSCanonizeManager;
    private apiUrl: string;

    public constructor(manager:CSCanonizeManager,apiUrl:string) {

        this.canonize = manager ;
        this.apiUrl = apiUrl;
    }

    public async getCollections():Promise<AssetCollection[]>{

        let response:any = await this.apiCall('collections/');
        //console.log(response)
        let collections:AssetCollection[] = [];

        response.data.forEach((collection:AssetCollectionInterface) => {

           let oneCollection = this.canonize.createCollection(collection);
           collections.push(oneCollection)


        })
        return collections ;



    }

    public async apiCall(path:string) {

        let url:string = this.apiUrl ;
        let base:string = 'api/v1/'

        return new Promise((resolve:any,reject:any) => {
            const xmlhttp = new XMLHttpRequest();

            xmlhttp.open("GET", url+base+path);
            xmlhttp.send();
            console.log(url+base+path);
            xmlhttp.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    let response = JSON.parse(this.responseText);

                    resolve (response);
                }else if (this.readyState == 4)
                    reject ('Bad request :' + this.status);
            }
        });
    }



}