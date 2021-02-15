import {Entity} from "../Entity.js";
import {Concept} from "../Concept.js";
import {BlockchainToken} from "./BlockchainToken.js";
import {CSCanonizeManager} from "./CSCanonizeManager.js";

interface specifier {
    concept:Concept
    value:string

}

export abstract class ContractStandard extends Entity{


    specifierArray:Map<Concept,string> = new Map<Concept,string>()
    name:string = 'genericStandard' ;

    protected setSpecifierValue(concept:Concept,value:string){

        this.specifierArray.set(concept,value);

    }

    public getSpecifierArray():Map<Concept,string>{


        return this.specifierArray ;
    }

    public abstract getDisplayStructure():string;

    public generateTokenPathEntity(canonizeManager:CSCanonizeManager){

        return new BlockchainToken(canonizeManager,this.getDisplayStructure());

    }

    public getName(){

        return this.name ;
    }

}