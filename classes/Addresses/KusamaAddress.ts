import {BlockchainAddress} from "./BlockchainAddress";
import {Kusama} from "../Blockchains/Kusama";


export class KusamaAddress extends BlockchainAddress
{

    constructor(addr: string){
        super(new Kusama(), addr);
    }

}