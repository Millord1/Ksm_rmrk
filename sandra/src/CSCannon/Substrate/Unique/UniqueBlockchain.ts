import {SubstrateBlockchain} from "../SubstrateBlockchain";
import {SandraManager} from "../../../SandraManager";
import {Blockchain} from "../../Blockchain.js";

export class UniqueBlockchain extends Blockchain
{

    public  name: string = 'uniqueBlockchain';


    public constructor(sandra: SandraManager) {

        super(sandra,'uniqueBlockchain');

        this.addressFactory.is_a = 'uniqueAddress';
        this.addressFactory.contained_in_file = 'uniqueAddressFile';

        this.contractFactory.is_a = 'uniqueContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';


    }

}