import {BlockchainAddress} from "./BlockchainAddress";
import {Kusama} from "../Blockchains/Kusama";


export class KusamaAddress extends BlockchainAddress
{

    public static blockchain = Kusama;

    constructor(){
        super();
    }

}