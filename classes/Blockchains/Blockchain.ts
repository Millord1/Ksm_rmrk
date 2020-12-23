import {Polkadot} from "./Polkadot";
import {BlockchainAddress} from "../Addresses/BlockchainAddress";

interface BlockchainInterface
{
    name: string;
    symbol: string;
    prefix: string;
    isSubstrate: boolean;

}


export class Blockchain implements BlockchainInterface
{
    name;
    symbol;
    prefix;
    isSubstrate;

    constructor(name, symbol, prefix, isSubstrate){
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
    }

}
