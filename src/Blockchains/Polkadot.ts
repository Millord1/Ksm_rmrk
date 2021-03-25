import {Blockchain} from "./Blockchain";


export class Polkadot extends Blockchain
{

    public constructor() {
        super("DOT", "", false, "wss://rpc.polkadot.io/", 10);
    }

}