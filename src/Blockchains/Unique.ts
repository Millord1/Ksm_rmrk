import {Blockchain} from "./Blockchain";
import {GenericBlockchain} from "./GenericBlockchain";

export class Unique extends GenericBlockchain
{

    public constructor() {
        const secondTestNet: string = "wss://testnet2.uniquenetwork.io";
        // const secondTestNet: string = "wss://testnet2.unique.network";
        super("UNQ", "", true, secondTestNet, 15);
    }

}