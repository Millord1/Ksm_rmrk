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
    public updateOnExistingRef: Concept;
    public brotherEntityMap:Map<Concept,Map<Concept, Entity[]>> = new Map<Concept,Map<Concept, Entity[]>>();



    public constructor(isa:string,containedIn:string,sandraManager:SandraManager, updateOnExistingRef?:Concept) {

        this.is_a = isa;
        this.contained_in_file = containedIn;
        this.sandraManager = sandraManager;
        if (updateOnExistingRef == null){
            updateOnExistingRef = sandraManager.get('null_concept');
        }
        this.updateOnExistingRef = updateOnExistingRef ;


    }

    public addEntity(entity:Entity){

    this.entityArray.push(entity);
    let factory = this ;

    entity.referenceArray.forEach(element => {

        factory.sandraManager.registerNewReference(element);
        factory.refMap.set(element.concept.unid,element.concept.shortname);

        let refMapByConcept:Map<string, Entity[]>;
        console.log()
        if (!this.entityByRevValMap.has(element.concept)){

            refMapByConcept = new Map<string, Entity[]>() ;
            this.entityByRevValMap.set(element.concept,refMapByConcept);
        }
        else {
            // @ts-ignore
            refMapByConcept = this.entityByRevValMap.get(element.concept);
        }

        if (refMapByConcept.has(element.value)) {
            let existingElement = refMapByConcept.get(element.value);
            // @ts-ignore
            existingElement.push(entity);
        }
        else {
            refMapByConcept.set(element.value, [entity]);
        }

    })

    }

    public getOrUpdateEntity(entity:Entity,onRefConcept?:Concept){

        const updateOn = onRefConcept ? onRefConcept : this.updateOnExistingRef ;

        this.entityArray.find(element => element.getRefValue(updateOn))



    }

    public joinFactory(entityFactory:EntityFactory,onVerb:string){


       if ( this.joinedFactory.find(e => e.onVerb === onVerb) ) return ;

        let createOnRef = entityFactory.updateOnExistingRef ;
        this.joinedFactory.push({entityFactory,onVerb,createOnRef} );

    }


}

