import {BlockchainAddressFactory} from "./BlockchainAddressFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";
import {BlockchainEventFactory} from "./BlockchainEventFactory.js";

export class Blockchain {

    public addressFactory:BlockchainAddressFactory
    public  name: string = 'genericBlockchain';

    public static TXID_CONCEPT_NAME = 'txid';
    public contractFactory: BlockchainContractFactory;
    public eventFactory: BlockchainEventFactory;

    public constructor(sandra:SandraManager) {

        this.addressFactory = new BlockchainAddressFactory(sandra);
        this.contractFactory = new BlockchainContractFactory(sandra);
        this.eventFactory = new BlockchainEventFactory(this,sandra);


    }



}