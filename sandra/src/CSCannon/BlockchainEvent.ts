import {Entity} from "../Entity.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainEventFactory} from "./BlockchainEventFactory.js";
import {BlockchainAddress} from "./BlockchainAddress.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Reference} from "../Reference.js";
import {Blockchain} from "./Blockchain.js";

export class BlockchainEvent extends Entity {

    public static EVENT_SOURCE_ADDRESS = 'source';
    public static EVENT_DESTINATION_VERB = 'hasSingleDestination';
    public static EVENT_SOURCE_CONTRACT = 'sourceBlockchainContract';
    public static EVENT_BLOCK_TIME = 'timestamp';
    public static QUANTITY = 'quantity';


    public constructor(factory:BlockchainEventFactory|null,

                       source:BlockchainAddress|string,
                       destination:BlockchainAddress|string,
                       contract:BlockchainContract|string,
                       txid:string,
                       timestamp:string,
                       quantity:string,
                       blockchain:Blockchain,
                        sandra:SandraManager,

    ) {


        if (factory == null)
            factory = new BlockchainEventFactory(blockchain,sandra)

        let txidRef = new Reference(sandra.get(Blockchain.TXID_CONCEPT_NAME),txid);

        super(factory,[txidRef]);

        if ( typeof source == "string"){
            source = blockchain.addressFactory.getOrCreate(source)
        }
        if ( typeof destination == "string"){
            destination = blockchain.addressFactory.getOrCreate(destination)
        }
        if ( typeof contract == "string"){
            contract = blockchain.addressFactory.getOrCreate(contract)
        }



        this.addReference(  new Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME),timestamp));
        this.addReference(  new Reference(sandra.get(BlockchainEvent.QUANTITY),quantity));

        this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS,source,sandra)
        this.joinEntity(BlockchainEvent.EVENT_DESTINATION_VERB,destination,sandra)
        this.joinEntity(BlockchainEvent.EVENT_SOURCE_CONTRACT,contract,sandra)


    }



}

