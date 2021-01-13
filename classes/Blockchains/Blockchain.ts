import {BlockchainAddress} from "../Addresses/BlockchainAddress.js";
import {BlockchainInterface, publicEntity} from "../Interfaces.js";


export abstract class Blockchain implements BlockchainInterface
{
    name: string;
    symbol: string;
    prefix: string;
    isSubstrate: boolean;
    wsProvider: string;
    protected constructor(name: string, symbol: string, prefix: string, isSubstrate: boolean, wsProvider: string){
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
    }
    toJsonSerialize = () : BlockchainInterface => ({
        name: this.name,
        symbol: this.symbol,
        prefix: this.prefix,
        isSubstrate: this.isSubstrate,
        // address: this.address
    })
}
