
import {BlockchainAddress} from "../Addresses/BlockchainAddress.js";
import {KusamaAddress} from "../Addresses/KusamaAddress.js";
import {BlockchainInterface} from "../Interfaces.js";


export abstract class Blockchain implements BlockchainInterface
{

    name: string;
    symbol: string;
    prefix: string;
    isSubstrate: boolean;
    wsProvider: string;

    constructor(name: string, symbol: string, prefix: string, isSubstrate: boolean, wsProvider: string){
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
    }


    public getAddressClass(address: string): BlockchainAddress {

        switch (this.name.toLowerCase()){
            case 'kusama':
            default:
                return new KusamaAddress(address);

        }

    }


    toJsonSerialize = () : BlockchainInterface => ({
        name: this.name,
        symbol: this.symbol,
        prefix: this.prefix,
        isSubstrate: this.isSubstrate,
    })

}
