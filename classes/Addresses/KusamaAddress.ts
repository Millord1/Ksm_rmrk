import {BlockchainAddress} from "./BlockchainAddress.js";
import {Kusama} from "../Blockchains/Kusama.js";
import {Blockchain} from "../Blockchains/Blockchain.js";


export class KusamaAddress extends BlockchainAddress
{
    public  blockchain:Blockchain

    constructor(address: string){
        super(address, "Kusama");
        this.blockchain = new Kusama();
    }
}