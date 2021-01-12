import {Concept} from "./Concept.js";
import {SandraManager} from "./SandraManager";

export class Reference {


    refId:number | null
    concept:Concept ;


    value:string

    public constructor(concept:Concept,value:string) {



        this.refId = 0 ;
        this.concept = concept
        this.value = value ;
    }


}