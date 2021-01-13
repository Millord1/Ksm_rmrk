import {Blockchain} from "./Blockchain.js";
import {UniqueAddress} from "../Addresses/UniqueAddress.js";
import {UniqueContract} from "../Contract/UniqueContract.js";

export class Unique extends Blockchain
{

    static contractClass = UniqueContract

    constructor() {
        super("Usetech", "Uniq", "", false, UniqueAddress);
        this.wsProvider = 'wss://unique.usetech.com';
    }

}