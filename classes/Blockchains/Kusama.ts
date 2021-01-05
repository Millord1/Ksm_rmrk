import {SubstrateChain} from "./SubstrateChain";
import {KusamaAddress} from "../Addresses/KusamaAddress";
import {KusamaContract} from "../Contract/KusamaContract";


export class Kusama extends SubstrateChain
{

    static contractClass = new KusamaContract();

    constructor(){
        super("Kusama", "KSM", "", true, new KusamaAddress());
        this.wsProvider = 'wss://kusama-rpc.polkadot.io/';
    }



    public toJson(needSubstrate : boolean = true){

        const json = this.toJsonSerialize();

        if(this.isSubstrate && needSubstrate){
            json['substrateOf'] = this.substrateOf
        }

        return json;
    }

}
