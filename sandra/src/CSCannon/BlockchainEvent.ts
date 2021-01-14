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


     constructor(factory:BlockchainEventFactory|null,

                       source:BlockchainAddress,
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




        this.addReference(  new Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME),timestamp));
        this.addReference(  new Reference(sandra.get(BlockchainEvent.QUANTITY),quantity));

        this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS,source,sandra)
        this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS,destination,sandra)
        this.joinEntity(BlockchainEvent.EVENT_SOURCE_CONTRACT,contract,sandra)


    }



}

interface IBox {
    x : number;
    y : number;
    height : number;
    width : number;
}

class Box {
    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor();
    constructor(obj: IBox);
    constructor(obj?: any) {
        this.x = obj && obj.x || 0
        this.y = obj && obj.y || 0
        this.height = obj && obj.height || 0
        this.width = obj && obj.width || 0;
    }
}

