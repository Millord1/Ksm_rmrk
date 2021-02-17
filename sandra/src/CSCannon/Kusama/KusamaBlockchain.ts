import {Blockchain} from "../Blockchain.js";
import {SandraManager} from "../../SandraManager.js";


export class KusamaBlockchain extends Blockchain
{
    
    public  name: string = 'kusama';


    public constructor(sandra: SandraManager) {

        super(sandra);

        this.name = 'kusama';

        this.addressFactory.is_a = 'kusamaAddress';
        this.addressFactory.contained_in_file = 'kusamaAddressFile';
        this.addressFactory.onBlockchain = this.name ;

        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'blockchainContractFile';




    }
    
}