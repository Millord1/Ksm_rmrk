import {Blockchain} from "../Blockchain.js";
import {SandraManager} from "../../SandraManager.js";


export class EthereumBlockchain extends Blockchain {

    public static blockchainName:string = 'ethereum';


    public constructor(sandra:SandraManager) {

      super(sandra);
      this.addressFactory.is_a = 'ethAddress';
      this.addressFactory.contained_in_file = 'ethAddressFile';

      this.contractFactory.is_a = 'ethContract';
      this.contractFactory.contained_in_file = 'ethContractFile';



    }



}