import {SubstrateChain} from "./SubstrateChain.js";


export class Kusama extends SubstrateChain
{

    public constructor(){
        super("Kusama", "KSM", "", true, 'wss://kusama-rpc.polkadot.io/');
    }


    public toJson(needSubstrate : boolean = true){

        const json = this.toJsonSerialize();
        if(this.isSubstrate && needSubstrate){
            // @ts-ignore
            json['substrateOf'] = this.substrateOf
        }
        return json;
    }
}
