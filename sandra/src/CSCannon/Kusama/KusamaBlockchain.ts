import {Blockchain} from "../Blockchain.js";
import {SandraManager} from "../../SandraManager.js";


export class KusamaBlockchain extends Blockchain
{
    
    public static blockchainName: string = 'kusama';


    public constructor(sandra: SandraManager) {

        super(sandra);

        this.addressFactory.is_a = 'kusmaAddress';
        this.addressFactory.contained_in_file = 'kusmaAddressFile';

        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'rmrkContractFile';
    }
    
}