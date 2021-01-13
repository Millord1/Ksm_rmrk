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

    constructor(factory:BlockchainEventFactory,source:string,destination:string,contract:string,txid:string,timestamp:string,quantity:string,blockchain:Blockchain,sandra:SandraManager) ;

    public constructor(factory:BlockchainEventFactory|null,

                       source:BlockchainAddress|string,
                       destination:BlockchainAddress,
                       contract:BlockchainContract,
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
            source = blockchain.addressFactory.getOrCreate()
        }



        this.addReference(  new Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME),timestamp));
        this.addReference(  new Reference(sandra.get(BlockchainEvent.QUANTITY),quantity));

        this.joinEntity(source,BlockchainEvent.EVENT_SOURCE_ADDRESS,sandra)
        this.joinEntity(destination,BlockchainEvent.EVENT_DESTINATION_VERB,sandra)
        this.joinEntity(contract,BlockchainEvent.EVENT_SOURCE_CONTRACT,sandra)


    }



}

