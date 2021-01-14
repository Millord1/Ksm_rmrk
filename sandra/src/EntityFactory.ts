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
    public entityByRevValMap:Map<Concept,Map<string, Entity[]>> = new Map<Concept,Map<string, Entity[]>>();
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
        console.log("entering element");
        console.log(element);

        factory.sandraManager.registerNewReference(element);
        factory.refMap.set(element.concept.unid,element.concept.shortname);

        let refMapByConcept:Map<string, Entity[]>;
        console.log()
        if (!this.entityByRevValMap.has(element.concept)){

            refMapByConcept = new Map<string, Entity[]>() ;
            this.entityByRevValMap.set(element.concept,refMapByConcept);
        }
        else {
            refMapByConcept = this.entityByRevValMap.get(element.concept);
        }

        console.log(refMapByConcept);

        if (refMapByConcept.has(element.value)) {
            let existingElement = refMapByConcept.get(element.value);
            existingElement.push(entity);
        }
        else {
            refMapByConcept.set(element.value, [entity]);
        }

    })

    }

    public joinFactory(entityFactory:EntityFactory,onVerb:string,createOnRef:Concept = this.sandraManager.get('null_concept')){

        this.joinedFactory.push({entityFactory,onVerb,createOnRef} );

    }


}

