import {MetaDataInputs} from "./Interfaces.js";


export class Metadata
{

    private url: string;

    public external_url: string = "";
    public image: string = "";
    public description: string = "";
    public name: string = "";
    public attributes: Array<string> = [];
    public background_color: string = "";


     constructor(url: string, metas: MetaDataInputs) {

         this.url = url;
         this.external_url = metas.external_url;
         this.image = metas.image;
         this.description = metas.description;
         this.name = metas.name;
         this.attributes = metas.attributes;
         this.background_color = metas.background_color;
    }



}