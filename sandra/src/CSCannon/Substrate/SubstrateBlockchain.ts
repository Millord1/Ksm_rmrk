import {Blockchain} from "../Blockchain.js";
import {SandraManager} from "../../SandraManager.js";


export class SubstrateBlockchain extends Blockchain {

    public static blockchainName:string = 'substrate';


    public constructor(sandra:SandraManager) {

      super(sandra);
      this.addressFactory.is_a = 'substrateAddress';
      this.addressFactory.contained_in_file = 'substrateAddressFile';


    }



}