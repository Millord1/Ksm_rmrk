import {SubstrateBlockchain} from "../SubstrateBlockchain";
import {SandraManager} from "../../../SandraManager";
import {Blockchain} from "../../Blockchain.js";

export class KusamaBlockchain extends Blockchain
{

    public  name: string = 'kusama';


    public constructor(sandra: SandraManager) {

        super(sandra,'kusama');

        this.name = 'kusama';

        this.addressFactory.is_a = 'kusamaAddress';
        this.addressFactory.contained_in_file = 'blockchainAddressFile';
        this.addressFactory.onBlockchain = this.name ;

        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';



    }

}