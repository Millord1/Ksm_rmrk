
import {Unique} from "../Blockchains/Unique.js";
import {BlockchainAddress} from "./BlockchainAddress.js";

export class UniqueAddress extends BlockchainAddress
{
    constructor() {
        super();
        UniqueAddress.blockchain = new Unique();
        this.blockchainName = UniqueAddress.blockchain.name;
    }

}