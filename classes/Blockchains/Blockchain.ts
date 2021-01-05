import {BlockchainAddress} from "../Addresses/BlockchainAddress";
import {BlockchainInterface, publicEntity} from "../Interfaces";


export abstract class Blockchain implements BlockchainInterface
{
    name;
    symbol;
    prefix;
    isSubstrate;
    address: BlockchainAddress;
    wsProvider;

    protected constructor(name, symbol, prefix, isSubstrate, addressClass){
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.address = addressClass;
    }

    public getAddressClass(){
        return this.address;
    }


    toJsonSerialize = () : BlockchainInterface => ({
        name: this.name,
        symbol: this.symbol,
        prefix: this.prefix,
        isSubstrate: this.isSubstrate,
        // address: this.address
    })


}
