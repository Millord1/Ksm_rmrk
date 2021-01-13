import {BlockchainAddress} from "./BlockchainAddress.js";
import {Unique} from "../Blockchains/Unique.js";

export class UniqueAddress extends BlockchainAddress
{
    constructor() {
        super();
        UniqueAddress.blockchain = new Unique();
        this.blockchainName = UniqueAddress.blockchain.name;
    }

}