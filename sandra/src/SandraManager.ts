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

    private name:string = 'helloWalid';
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

    public demo(){


            var entityFactory = new EntityFactory('cat','testFile',this);
            var felix = new Entity(entityFactory, [
                new Reference(this.get('name'),'felix'),
                new Reference(this.get('age'),'3')
            ]);
            var miaous = new Entity(entityFactory, [
            new Reference(this.get('name'),'miaous'),
            new Reference(this.get('age'),'10')
        ]);


            var ownerFactory = new EntityFactory("person",'peopleFile',this);
            let mike =  new Entity(ownerFactory).addReference(new Reference(this.get('name'),'mike'))
            let jown =  new Entity(ownerFactory).addReference(new Reference(this.get('name'),'jown'))


            entityFactory.joinFactory(ownerFactory,'hasMaster',this.get('name'))
            entityFactory.joinFactory(entityFactory,'friendWith',this.get('name'))

            felix.joinEntity(mike,'hasMaster',this);
            felix.joinEntity(jown,'hasMaster',this);

            felix.joinEntity(miaous,'friendWith',this);

            let gossiper = new Gossiper(entityFactory,this.get('name'));

            console.log(JSON.stringify(gossiper.exposeGossip()));

            console.log(this.conceptList);
        console.log(this.entityList);
        console.log(this.refList);


    }

    public cannonDemo(connector:CrystalSuiteConnector){

        let blockchain = new EthereumBlockchain(this);

        var blockchainEventFactory= blockchain.eventFactory ;
        let source = new BlockchainAddress(blockchain.addressFactory,'MyFirstAddress',this);
        let destination = new BlockchainAddress(blockchain.addressFactory,'MysecondAddress',this);
        let contract = new BlockchainContract(blockchain.contractFactory,'myContract',this);

        let event1 = new BlockchainEvent(blockchainEventFactory,source,destination,contract,'myTX','11111111',"1",blockchain,this);

        let gossiper = new Gossiper(blockchainEventFactory,this.get(Blockchain.TXID_CONCEPT_NAME));
        connector.gossip(gossiper).then(r=>{console.log(r)});




    }


}