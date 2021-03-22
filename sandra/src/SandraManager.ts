import {EntityFactory} from "./EntityFactory.js";
import {Concept} from "./Concept.js";
import {Entity} from "./Entity.js";
import {Reference} from "./Reference.js";
import {Gossiper} from "./Gossiper.js";
import {BlockchainEventFactory} from "./CSCannon/BlockchainEventFactory.js";
import {BlockchainEvent} from "./CSCannon/BlockchainEvent.js";
import {BlockchainAddress} from "./CSCannon/BlockchainAddress.js";
import {BlockchainContract} from "./CSCannon/BlockchainContract.js";
import {Blockchain} from "./CSCannon/Blockchain.js";
import {CrystalSuiteConnector} from "../../CrystalSuiteConnector.js";
import {EthereumBlockchain} from "./CSCannon/Ethereum/EthereumBlockchain.js";

export class SandraManager {


    public invisible: string | null = null ;
    public conceptMap:Map<string,Concept> ;
    public entityMap:Map<number,Entity> ;
    public conceptList:Array<Concept> = []
    public entityList:Array<Entity> = [];
    public refList:Array<Reference> = [];

    public constructor() {

        this.conceptMap = new Map<string,Concept>();
       this.entityMap = new Map<number, Entity>();
       this.registerNewConcept('null_concept');

    }

    private registerNewConcept(shortname:string){

        let conceptId = this.conceptList.length

        let concept = new Concept(conceptId,shortname);

        this.conceptMap.set(concept.shortname,concept);
        this.conceptList.push(concept);
        return concept ;

    }

    public registerNewEntity(entity:Entity){

        entity.id = this.entityList.length ;

        this.entityMap.set(entity.id,entity);
        this.entityList.push(entity);
        return entity ;

    }

    public registerNewReference(ref:Reference){

        ref.refId = this.refList.length ;
        this.refList.push(ref);
        return ref ;

    }

    public get(shortname:string):Concept{

        if (this.conceptMap.get(shortname))
        return <Concept>this.conceptMap.get(shortname);

        return this.registerNewConcept(shortname);



    }
   // public somethingToConcept(something:any):Concept{
    public somethingToConcept(something:any):Concept{

       if (something instanceof Concept) return something ;
       if (typeof something === 'string'){
          return this.get(something);

       }
       if (typeof something === "number"){

            let concept =  [...this.conceptMap.values()].filter((item: Concept) => item.unid === something);
            return concept[0];
       }

       return this.get('null_concept');



    }






}