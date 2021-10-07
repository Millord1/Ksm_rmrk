import {Blockchain} from "./Blockchain";
import {RmrkBlockchain} from "./RmrkBlockchain";


export class Polkadot extends RmrkBlockchain
{

    public constructor() {
        super("DOT", "", false, "wss://rpc.polkadot.io/", 10);
    }

}