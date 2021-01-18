import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";

export class ContractStandardFactory extends EntityFactory{

    public is_a:string = 'blockchainStandard';
    public contained_in_file:string = 'blockchainStandardFile';

    constructor(sandra:SandraManager) {

        super('blockchainContract','blockchainStandardFile',sandra);

        this.updateOnExistingRef = sandra.get('class_name');
    }



}