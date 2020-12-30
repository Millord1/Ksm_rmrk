import {Blockchain} from "./Blockchain";
import {KusamaAddress} from "../Addresses/KusamaAddress";


export class Polkadot extends Blockchain
{
    constructor() {
        super("Polkadot", "DOT", "", false, KusamaAddress);
        this.wsProvider = 'wss://rpc.polkadot.io';
    }
}