
import {KusamaAddress} from "../Addresses/KusamaAddress.js";
import {PolkadotContract} from "../Contract/PolkadotContract.js";
import {Blockchain} from "./Blockchain.js";


export class Polkadot extends Blockchain
{

    static contractClass = PolkadotContract

    constructor() {
        super("Polkadot", "DOT", "", false, 'wss://rpc.polkadot.io');
    }

    public toJson(){
        return this.toJsonSerialize();
    }
}