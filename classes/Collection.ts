import {Blockchain} from "./Blockchains/Blockchain";
import {Address} from "./Address";


export class Collection
{
    version: string;
    name: string;
    max: number;
    issuer: Address;
    symbol: string;
    id: string;
    metadata: string;
    blockchain: Blockchain

    // constructor(name: string, issuer: Address, blockchain: Blockchain){
    //     this.name = name;
    //     this.issuer = issuer;
    //     this.blockchain = blockchain;
    // }

}