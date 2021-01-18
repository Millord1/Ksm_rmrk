import {Entity} from "../Entity.js";
import {BlockchainAddressFactory} from "./BlockchainAddressFactory";
import {SandraManager} from "../SandraManager.js";
import {Reference} from "../Reference.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";
import {ContractStandard} from "./ContractStandard.js";

export class BlockchainContract extends Entity{


    public constructor(factory:BlockchainContractFactory|null,id:string,sandraManager:SandraManager,standard:ContractStandard |null = null) {

        if (factory == null) factory = new BlockchainContractFactory(sandraManager);

        super(factory);

        this.addReference(new Reference(sandraManager.get('id'),id));

        //if the contract has a standard we bind it
        if (standard){
            this.joinEntity('contractStandard',standard,sandraManager);
        }

    }

}