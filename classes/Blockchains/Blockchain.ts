import {Polkadot} from "./Polkadot";
import {BlockchainAddress} from "../Addresses/BlockchainAddress";
import {BlockchainInterface} from "../Rmrk/Interfaces";


export class Blockchain implements BlockchainInterface
{
    name;
    symbol;
    prefix;
    isSubstrate;
    addressClass: BlockchainAddress;

    constructor(name, symbol, prefix, isSubstrate, addressClass){
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.addressClass = addressClass;
    }

    public getAddressClass(){
        return this.addressClass;
    }

}
