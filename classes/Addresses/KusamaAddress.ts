import {BlockchainAddress} from "./BlockchainAddress.js";
import {Kusama} from "../Blockchains/Kusama.js";


export class KusamaAddress extends BlockchainAddress
{

    constructor(){
        super();
        KusamaAddress.blockchain = new Kusama();
        this.blockchainName = KusamaAddress.blockchain.name;
    }

}