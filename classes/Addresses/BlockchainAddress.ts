import {Blockchain} from "../Blockchains/Blockchain";
import {SubstrateChain} from "../Blockchains/SubstrateChain";

export class BlockchainAddress
{
    address: string;
    chain: Blockchain|SubstrateChain

    constructor(blockchain: Blockchain, address){
        this.chain = blockchain;
        this.address = address;
    }

}