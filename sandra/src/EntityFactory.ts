import {Concept} from "./Concept.js";
import {SandraManager} from "./SandraManager.js";
import {Entity} from "./Entity";
import {Reference} from "./Reference";

interface JoinedFactory{
    entityFactory:EntityFactory;
    onVerb:string
    createOnRef:Concept

}

export class EntityFactory {

    public is_a:string
    public contained_in_file:string
    public entityArray:Entity[] = [];
    public storage:string = '';
    public refMap:Map<number, string> = new Map<number, string>();
    public joinedFactory:JoinedFactory[] = [];
    public sandraManager: SandraManager;



    public constructor(isa:string,containedIn:string,sandraManager:SandraManager) {

        this.is_a = isa;
        this.contained_in_file = containedIn;
        this.sandraManager = sandraManager;


    }

    public addEntity(entity:Entity){

    this.entityArray.push(entity);
    let factory = this ;

    entity.referenceArray.forEach(element => {

        factory.sandraManager.registerNewReference(element);
        factory.refMap.set(element.concept.unid,element.concept.shortname);

    })

    }

    public joinFactory(entityFactory:EntityFactory,onVerb:string,createOnRef:Concept = this.sandraManager.get('null_concept')){

        this.joinedFactory.push({entityFactory,onVerb,createOnRef} );

    }


}

