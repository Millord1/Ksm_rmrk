import {Blockchain} from "./Blockchain";


export class WestEnd extends Blockchain{
    public constructor() {
        super("WND", "", true, "wss://westend-rpc.polkadot.io/", 10);
    }
}