import {BlockchainAddress} from "./BlockchainAddress.js";
import {Kusama} from "../Blockchains/Kusama.js";
import {Blockchain} from "../Blockchains/Blockchain.js";


export class KusamaAddress extends BlockchainAddress
{
    public  blockchain:Blockchain
    constructor(){
        super();
        this.blockchain = new Kusama();
        this.blockchainName = this.blockchain.name;

    }
}