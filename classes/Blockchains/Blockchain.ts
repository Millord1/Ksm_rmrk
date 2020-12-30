import {BlockchainAddress} from "../Addresses/BlockchainAddress";
import {BlockchainInterface} from "../Interfaces";


export abstract class Blockchain implements BlockchainInterface
{
    name;
    symbol;
    prefix;
    isSubstrate;
    addressClass: BlockchainAddress;
    wsProvider;

    protected constructor(name, symbol, prefix, isSubstrate, addressClass){
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
