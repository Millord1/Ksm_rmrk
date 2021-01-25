import {metaDatasInputs} from "./Interfaces.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export class Metadatas
{

    private protocol: string;
    private url: string;

    public external_url: string = "";
    public image: string = "";
    public description: string = "";
    public name: string = "";
    public attributes: Array<string> = [];
    public background_color: string = "";

    constructor(protocol: string, url: string) {

        this.protocol = protocol;
        this.url = url;

        const metas = this.getMetadatasContent(this.protocol, this.url).then(
            result => {
                this.external_url = result.external_url;
                this.image = result.image;
                this.description = result.description;
                this.name = result.name;
                this.attributes = result.attributes;
                this.background_color = result.background_color;
            }
        );

        // console.log(json);



    }


    private async getMetadatasContent(protocol: string, url: string){


        const ipfs = (protocol === "ipfs") ? 'ipfs.io/' : '';
        const urlToCall = protocol + ipfs + url;

        const get = new XMLHttpRequest();

        let jason : metaDatasInputs;

        get.open("GET", 'https://' + urlToCall);
        get.send();

        get.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const json = JSON.parse(this.responseText);

                // json.forEach((key, value) => {
                //     jason[key] = value;
                // })
                jason.external_url = json.hasOwnProperty('external_url') ? json.external_url : '';
                jason.image = json.hasOwnProperty('image') ? json.image : '';
                jason.description = json.hasOwnProperty('description') ? json.description : '';
                jason.name = json.hasOwnProperty('name') ? json.name : '';
                jason.attributes = json.hasOwnProperty('attributes') ? json.attributes : '';
                jason.background_color = json.hasOwnProperty('background_color') ? json.background_color : '';

                // console.log(typeof jason);


                return jason;
            }
        }


        // const ipfs = await IPFS.create();
        // return await ipfs.cat(url);


        // TODO complete with real ipfs metadatas link

        // const url = "ipfs.io/ipfs/QmSkmCWNBoMGyd1d1TzQpgAakRCux5JAqQpRjDSNiv3DDB";
        // const url = "ipfs.io/ipfs/QmcQpkNDoYbFPbwPUAaS2ACnKpBib1z6VWDGD1qFtYvfdZ";
        //
        // const get = new XMLHttpRequest();
        //
        // let jason: metaDatasInputs;
        //
        // get.onreadystatechange = function () {
        //     if (this.readyState == 4 && this.status == 200) {
        //         jason = JSON.parse(this.responseText);
        //         return jason;
        //     }
        // }
        //
        // get.open("GET", 'https://' + url);
        // get.send();
    }

}