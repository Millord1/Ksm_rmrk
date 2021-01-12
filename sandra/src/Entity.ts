import {Reference} from "./Reference.js";
import {EntityFactory} from "./EntityFactory.js";
import {Concept} from "./Concept.js";
import {SandraManager} from "./SandraManager";

export class Entity{

    public subjectConcept:Concept ;
    public id:number ;
    public referenceArray:Reference[] = [];


    public constructor(factory:EntityFactory, references:Array<Reference>=[]) {

        this.id = 0 ;
        factory.sandraManager.registerNewEntity(this);

        this.subjectConcept = factory.sandraManager.get('entity:subject:'+this.id);

        references.forEach(ref =>{

            this.addReference(ref);

        })

        factory.addEntity(this);
       // this.factory = factory ;

    }

    public addReference(ref:Reference){

        this.referenceArray.push(ref);
        return this ;

    }

    public joinEntity(verb:string,entity:Entity,sandraManager:SandraManager){
        this.subjectConcept.setTriplet(sandraManager.get(verb),entity.subjectConcept)



    }


}