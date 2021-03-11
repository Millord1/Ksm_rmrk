import {SubstrateBlockchain} from "../SubstrateBlockchain";
import {SandraManager} from "../../../SandraManager";
import {Blockchain} from "../../Blockchain.js";

export class WestendBlockchain extends Blockchain
{

    public  name: string = 'westend';


    public constructor(sandra: SandraManager) {

        super(sandra,'westend');

        this.name = 'westend';

        this.addressFactory.is_a = 'westendAddress';
        this.addressFactory.contained_in_file = 'kusamaAddressFile';
        this.addressFactory.onBlockchain = this.name ;

        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';



    }

}