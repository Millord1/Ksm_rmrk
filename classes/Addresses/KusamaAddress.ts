import {BlockchainAddress} from "./BlockchainAddress";
import {Kusama} from "../Blockchains/Kusama";


export class KusamaAddress extends BlockchainAddress
{

    constructor(){
        super();
        KusamaAddress.blockchain = Kusama;
        this.blockchainName = KusamaAddress.blockchain.name;
    }

}