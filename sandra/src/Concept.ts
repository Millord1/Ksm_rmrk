import {Reference} from "./Reference.js";

interface tripletRef {
    concept:Concept,
    refs:Reference[]

}

export class Concept {

    public unid:number ;
    public shortname:string ;
    public triplets:Map<Concept,Array<Concept>> ;
    public tripletsReferences:Map<Concept,Array<tripletRef>> ;
    public isPureShortname:boolean = false ;

    constructor(unid:number,shortname:string) {

        this.unid = unid ;
        this.shortname = shortname ;
        this.triplets = new Map<Concept, Array<Concept>>();
        this.tripletsReferences = new Map<Concept,Array<tripletRef>>() ;
    }

    public setTriplet(verb:Concept,target:Concept,notEntity:boolean = false,refs?:Reference[]){

        let verbExist = false ;
        if (this.triplets.get(verb)){
            // @ts-ignore
            this.triplets.get(verb).push(target);
            verbExist = true ;
        }
        else{
            this.triplets.set(verb,[target]);
            //this.tripletsReferences.set(verb,[target]);
        }

        if (notEntity) this.isPureShortname = true;

        if (refs){
            if (verbExist) {
                // @ts-ignore
                this.tripletsReferences.get(verb).push({concept: target, refs: refs})
            }
            else{
                this.tripletsReferences.set(verb,[{concept:target,refs:refs}])
            }
        }
    }

}