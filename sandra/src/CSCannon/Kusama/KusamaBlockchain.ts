import {Blockchain} from "../Blockchain";
import {SandraManager} from "../../SandraManager";


export class KusamaBlockchain extends Blockchain
{
    
    public static blockchainName: string = 'kusama';


    public constructor(sandra: SandraManager) {

        super(sandra);

        this.addressFactory.is_a = 'ksmAddress';
        this.addressFactory.contained_in_file = 'ksmAddressFile';

        this.contractFactory.is_a = 'ksmContract';
        this.contractFactory.contained_in_file = 'ksmContractFile';
    }
    
}