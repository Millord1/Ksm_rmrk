import {BlockchainAddressFactory} from "./BlockchainAddressFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";
import {BlockchainEventFactory} from "./BlockchainEventFactory.js";
import {EntityFactory} from "../EntityFactory.js";
import {BlockchainBlock} from "./BlockchainBlock.js";

export class Blockchain {

    public addressFactory:BlockchainAddressFactory
    public  name: string = 'genericBlockchain';

    public static TXID_CONCEPT_NAME = 'txHash';
    public contractFactory: BlockchainContractFactory;
    public eventFactory: BlockchainEventFactory;
    public blockFactory: EntityFactory;

    public constructor(sandra:SandraManager,name:string = 'genericBlockchain') {

        this.name = name ;
        this.addressFactory = new BlockchainAddressFactory(sandra);
        this.contractFactory = new BlockchainContractFactory(sandra);
        this.eventFactory = new BlockchainEventFactory(this,sandra);
        this.blockFactory = new EntityFactory(this.getName()+"Block","blockchainBlocFile",sandra,sandra.get(BlockchainBlock.INDEX_SHORTNAME));

    }

    public getName(){

        return this.name ;

    }



}