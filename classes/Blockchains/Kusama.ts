import {SubstrateChain} from "./SubstrateChain";
import {KusamaAddress} from "../Addresses/KusamaAddress";


export class Kusama extends SubstrateChain
{

    constructor(){
        super("Kusama", "KSM", "", true);
    }

}
