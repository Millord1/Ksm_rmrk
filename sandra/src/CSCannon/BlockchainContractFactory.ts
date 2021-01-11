import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";

export class BlockchainContractFactory extends EntityFactory{


    public contained_in_file:string = 'blockchainContractFile';

    public constructor(sandra:SandraManager) {

        super('blockchainContract','blockchainContractFile',sandra);
    }


}