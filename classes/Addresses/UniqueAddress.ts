import {BlockchainAddress} from "./BlockchainAddress";
import {Unique} from "../Blockchains/Unique";

export class UniqueAddress extends BlockchainAddress
{
    constructor() {
        super();
        UniqueAddress.blockchain = Unique;
        this.blockchainName = UniqueAddress.blockchain.name;
    }

}