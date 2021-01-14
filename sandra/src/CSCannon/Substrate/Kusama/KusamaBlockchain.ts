import {SubstrateBlockchain} from "../SubstrateBlockchain";
import {SandraManager} from "../../../SandraManager";
import {Blockchain} from "../../Blockchain.js";

export class KusamaBlockchain extends Blockchain
{

    public  name: string = 'kusama';


    public constructor(sandra: SandraManager) {

        super(sandra);

        this.addressFactory.is_a = 'kusamaAddress';
        this.addressFactory.contained_in_file = 'kusamaAddressFile';

        this.contractFactory.is_a = 'rmrkContract';
        this.contractFactory.contained_in_file = 'rmrkContractFile';
    }

}