import {Entity} from "../Entity.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainEventFactory} from "./BlockchainEventFactory";
import {BlockchainAddressFactory} from "./BlockchainAddressFactory.js";
import {Reference} from "../Reference.js";

export class BlockchainAddress extends Entity{

    public constructor(factory:BlockchainAddressFactory|null,address:string,sandraManager:SandraManager) {

        if (factory == null) factory = new BlockchainAddressFactory(sandraManager);

        super(factory);

        this.addReference(new Reference(sandraManager.get('address'),address));
        this.setTriplet(BlockchainAddressFactory.ON_BLOCKCHAIN,factory.onBlockchain,sandraManager);


    }

    public getAddress():string{


        return this.getRefValue('address') ? this.getRefValue('address') : '' ;
    }


}