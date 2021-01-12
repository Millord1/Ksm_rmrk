import {SubstrateBlockchain} from "../SubstrateBlockchain";
import {SandraManager} from "../../../SandraManager";

export class KusamaBlockchain extends SubstrateBlockchain {

    public constructor(sandra:SandraManager) {

        super(sandra);
        this.addressFactory.is_a = 'substrateAddress';
        this.addressFactory.contained_in_file = 'substrateAddressFile';


    }


}