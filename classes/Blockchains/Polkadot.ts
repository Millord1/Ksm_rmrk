import {Blockchain} from "./Blockchain";
import {KusamaAddress} from "../Addresses/KusamaAddress";
import {PolkadotContract} from "../Contract/PolkadotContract";


export class Polkadot extends Blockchain
{

    static contractClass = PolkadotContract

    constructor() {
        super("Polkadot", "DOT", "", false, KusamaAddress);
        this.wsProvider = 'wss://rpc.polkadot.io';
    }

    public toJson(){
        return this.toJsonSerialize();
    }
}