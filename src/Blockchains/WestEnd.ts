import {Blockchain} from "./Blockchain";
import {RmrkBlockchain} from "./RmrkBlockchain";


export class WestEnd extends RmrkBlockchain
{

    public constructor() {
        super("WND", "", true, "wss://westend-rpc.polkadot.io/", 12);
    }

}