import {MetaDataInputs} from "./Interfaces.js";
import {Entity} from "./Rmrk/Entity.js";


export class Metadata
{

    public url: string;

    public external_url: string = "";
    public image: string = "";
    public description: string = "";
    public name: string = "";
    public attributes: Array<Object> = [];
    public background_color: string = "";


     constructor(url: string, meta: MetaDataInputs) {

         this.url = url;
         this.external_url = meta.external_url;
         this.image = meta.image;
         this.description = meta.description;
         this.name = meta.name;
         this.background_color = meta.background_color;
         this.attributes = meta.attributes;
    }



}