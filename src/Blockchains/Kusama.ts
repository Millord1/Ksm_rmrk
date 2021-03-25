import {Blockchain} from "./Blockchain";

export class Kusama extends Blockchain
{

    public constructor() {
        super("KSM", "", true, "wss://kusama-rpc.polkadot.io/", 12);
    }


}