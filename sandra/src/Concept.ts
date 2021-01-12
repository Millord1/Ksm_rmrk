export class Concept {

    public unid:number ;
    public shortname:string ;
    public triplets:Map<Concept,Array<Concept>> ;

    constructor(unid:number,shortname:string) {

        this.unid = unid ;
        this.shortname = shortname ;
        this.triplets = new Map<Concept, Array<Concept>>();
    }

    public setTriplet(verb:Concept,target:Concept){

        if (this.triplets.get(verb)){
            // @ts-ignore
            this.triplets.get(verb).push(target);
        }
        else{
            this.triplets.set(verb,[target]);
        }



    }

}