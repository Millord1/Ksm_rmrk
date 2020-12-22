import {Blockchain} from "./Blockchains/Blockchain";

export class Address
{
    address: string;
    blockchain: Blockchain

    constructor(address: string, blockchain: Blockchain){
        this.address = address;
        this.blockchain = blockchain;
    }
}