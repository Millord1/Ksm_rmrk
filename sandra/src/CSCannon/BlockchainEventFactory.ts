import {BlockchainEvent} from "./BlockchainEvent.js";
import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainAddressFactory} from "./BlockchainAddressFactory.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";
import {Blockchain} from "./Blockchain.js";

export class BlockchainEventFactory extends EntityFactory{




    public constructor( blockchain:Blockchain,sandra:SandraManager) {

        super('blockchainEvent','blockchainEventFile',sandra);

        this.updateOnExistingRef = sandra.get('txId');

        this.joinFactory(blockchain.addressFactory,BlockchainEvent.EVENT_SOURCE_ADDRESS,sandra.get('address'));
        this.joinFactory(blockchain.addressFactory,BlockchainEvent.EVENT_DESTINATION_VERB,sandra.get('address'));
        this.joinFactory(blockchain.contractFactory,BlockchainEvent.EVENT_SOURCE_CONTRACT,sandra.get('id'));


    }




}