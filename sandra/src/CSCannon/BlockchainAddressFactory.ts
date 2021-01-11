import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";

export class BlockchainAddressFactory extends EntityFactory {

    public is_a:string = 'blockchainAddress';
    public contained_in_file:string = 'blockchainAddressFile';


    public constructor(sandra:SandraManager) {

        super('blockchainAddress','blockchainAddressFile',sandra);
    }




}