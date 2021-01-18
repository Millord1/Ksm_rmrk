import {BlockchainEvent} from "./BlockchainEvent.js";
import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainAddressFactory} from "./BlockchainAddressFactory.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";
import {Blockchain} from "./Blockchain.js";

export class BlockchainEventFactory extends EntityFactory{




    public constructor( blockchain:Blockchain,sandra:SandraManager) {

        super('blockchainEvent','blockchainEventFile',sandra);

        this.updateOnExistingRef = sandra.get(Blockchain.TXID_CONCEPT_NAME);

        // this.joinFactory(blockchain.addressFactory,BlockchainEvent.EVENT_SOURCE_ADDRESS);
        // this.joinFactory(blockchain.addressFactory,BlockchainEvent.EVENT_DESTINATION_VERB);
        // this.joinFactory(blockchain.contractFactory,BlockchainEvent.EVENT_SOURCE_CONTRACT);
        // this.joinFactory(blockchain.blockFactory,BlockchainEvent.EVENT_BLOCK);


    }




}