import {Blockchain} from "./Blockchain";
import {GenericBlockchain} from "./GenericBlockchain";

export class Unique extends GenericBlockchain
{

    public constructor() {
        // const firstTestNet: string = "wss://unique.usetech.com";
        const testNet: string = "wss://testnet2.unique.network";
        super("UNQ", "", true, testNet, 15);
    }

}