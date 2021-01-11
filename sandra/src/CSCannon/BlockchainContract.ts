import {Entity} from "../Entity.js";
import {BlockchainAddressFactory} from "./BlockchainAddressFactory";
import {SandraManager} from "../SandraManager.js";
import {Reference} from "../Reference.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";

export class BlockchainContract extends Entity{


    public constructor(factory:BlockchainContractFactory|null,id:string,sandraManager:SandraManager) {

        if (factory == null) factory = new BlockchainContractFactory(sandraManager);

        super(factory);

        this.addReference(new Reference(sandraManager.get('id'),id));

    }

}