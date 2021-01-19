import {Entity} from "../Entity.js";
import {Concept} from "../Concept.js";

interface specifier {
    concept:Concept
    value:string

}



export class ContractStandard extends Entity{


    specifierArray:Map<Concept,string> = new Map<Concept,string>()

    protected setSpecifierValue(concept:Concept,value:string){

        this.specifierArray.set(concept,value);

    }

    public getSpecifierArray():Map<Concept,string>{


        return this.specifierArray ;
    }

    public getSpecifierValue(concept:Concept):Map<Concept,string>{


        return this.specifierArray ;
    }




}