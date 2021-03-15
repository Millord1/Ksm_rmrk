import {SubstrateChain} from "./SubstrateChain";


export class WestEnd extends SubstrateChain
{

    public constructor() {
        super("Westend", "WE", "", true, "wss://westend-rpc.polkadot.io");
    }

}