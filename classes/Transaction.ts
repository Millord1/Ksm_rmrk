import {Blockchain} from "./Blockchains/Blockchain";
import {Address} from "./Address";
import {Token} from "./Token";


export class Transaction
{
    blockchain: Blockchain;
    from: Address;
    to: Address;
    token: Token
    time: number;

    constructor(
        blockchain: Blockchain,
        token: Token,
        from: Address,
        to: Address,
        time: number
    ){
        this.blockchain = blockchain;
        this.token = token;
        this.from = from;
        this.to = to;
        this.time = time;
    }

}