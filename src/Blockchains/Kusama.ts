import {Blockchain} from "./Blockchain";
import {RmrkBlockchain} from "./RmrkBlockchain";

export class Kusama extends RmrkBlockchain
{

    public constructor() {
        super("KSM", "", true, "wss://kusama-rpc.polkadot.io/", 12);
    }


}