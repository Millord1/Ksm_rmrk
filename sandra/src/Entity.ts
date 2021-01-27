import {Reference} from "./Reference.js";
import {EntityFactory} from "./EntityFactory.js";
import {Concept} from "./Concept.js";
import {SandraManager} from "./SandraManager";

//does this move to the other branche ?

export class Entity{

    public subjectConcept:Concept ;
    public id:number ;
    public referenceArray:Reference[] = [];
    public factory:EntityFactory ;
    public brotherEntityMap:Map<Concept,Map<Concept, Entity[]>> = new Map<Concept,Map<Concept, Entity[]>>();



    public constructor(factory:EntityFactory, references:Array<Reference>=[]) {

        this.id = 0 ;
        factory.sandraManager.registerNewEntity(this);

        this.subjectConcept = factory.sandraManager.get('entity:subject:'+this.id);

        references.forEach(ref =>{

            this.addReference(ref);

        })

        factory.addEntity(this);
        this.factory = factory ;

    }

    public addReference(ref:Reference){

        this.referenceArray.push(ref);
        return this ;

    }

    public getRefValue(concept:any){

       this.factory.sandraManager.somethingToConcept(concept);

    }


    public joinEntity(verb:string,entity:Entity,sandraManager:SandraManager,refArray?:Reference[]){
        this.subjectConcept.setTriplet(sandraManager.get(verb),entity.subjectConcept,false,refArray);
        this.factory.joinFactory(entity.factory,verb)


    }

    public setTriplet(verb:string,target:string,sandraManager:SandraManager,refArray?:Reference[]){
        this.subjectConcept.setTriplet(sandraManager.get(verb),sandraManager.get(target),false,refArray);

    }


}