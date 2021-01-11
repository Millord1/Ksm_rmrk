import {Blockchain} from "./Blockchain";
import {UniqueAddress} from "../Addresses/UniqueAddress";
import {UniqueContract} from "../Contract/UniqueContract";

export class Unique extends Blockchain
{

    static contractClass = UniqueContract

    constructor() {
        super("Usetech", "Uniq", "", false, UniqueAddress);
        this.wsProvider = 'wss://unique.usetech.com';
    }

}