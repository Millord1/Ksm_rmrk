import {Blockchain} from "./Blockchains/Blockchain";
import {BlockchainAddress} from "./Addresses/BlockchainAddress";


export class Collection
{
    version: string;
    name: string;
    max: number;
    issuer: BlockchainAddress;
    symbol: string;
    id: string;
    metadata: string;
    blockchain: Blockchain

    // constructor(name: string, issuer: BlockchainAddress, blockchain: Blockchain){
    //     this.name = name;
    //     this.issuer = issuer;
    //     this.blockchain = blockchain;
    // }

}