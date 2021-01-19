import {Entity} from "../Entity.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainEventFactory} from "./BlockchainEventFactory.js";
import {BlockchainAddress} from "./BlockchainAddress.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Reference} from "../Reference.js";
import {Blockchain} from "./Blockchain.js";
import {BlockchainBlock} from "./BlockchainBlock.js";
import {ContractStandard} from "./ContractStandard.js";

export class BlockchainEvent extends Entity {

    public static EVENT_SOURCE_ADDRESS = 'source';
    public static EVENT_DESTINATION_VERB = 'hasSingleDestination';
    public static EVENT_SOURCE_CONTRACT = 'blockchainContract';
    public static EVENT_BLOCK_TIME = 'timestamp';
    public static QUANTITY = 'quantity';
    public static ON_BLOCKCHAIN = 'onBlockchain';
    public static EVENT_BLOCK = 'onBlock';


    public constructor(factory:BlockchainEventFactory|null,

                       source:BlockchainAddress|string,
                       destination:BlockchainAddress|string,
                       contract:BlockchainContract|string,
                       txid:string,
                       timestamp:string,
                       quantity:string,
                       blockchain:Blockchain,
                       blockId:number,
                        token:ContractStandard | null,
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
            contract = blockchain.contractFactory.getOrCreate(contract)
        }



        this.addReference(  new Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME),timestamp));
        this.addReference(  new Reference(sandra.get(BlockchainEvent.QUANTITY),quantity));

        this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS,source,sandra)
        this.joinEntity(BlockchainEvent.EVENT_DESTINATION_VERB,destination,sandra)


        //create the block
       let blockchainBlock = new BlockchainBlock(blockchain.blockFactory,blockId,timestamp,sandra);
        this.joinEntity(BlockchainEvent.EVENT_BLOCK,blockchainBlock,sandra)

        this.setTriplet(BlockchainEvent.ON_BLOCKCHAIN,blockchain.name,sandra)

        let refArray:Reference[] = [];

        if (token){
            //we need to get the tokenpath data and add it as reference on the event
           let specifierMap = token.getSpecifierArray()

            for (let specifier of specifierMap) {
                console.log(specifier[0]);
                 refArray.push(new Reference(specifier[0],specifier[1]));
            }



        }

        this.joinEntity(BlockchainEvent.EVENT_SOURCE_CONTRACT,contract,sandra,refArray)


    }



}

