
import {BlockchainAddress} from "../Addresses/BlockchainAddress.js";
import {KusamaAddress} from "../Addresses/KusamaAddress.js";
import {BlockchainInterface} from "../Interfaces.js";
import {Polkadot} from "./Polkadot.js";
import {Unique} from "./Unique.js";
import {Kusama} from "./Kusama.js";


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


    // public static getBlockchain(chain: string): Blockchain{
    //
    //     let blockchain: Blockchain;
    //
    //     switch (chain){
    //         case "polkadot":
    //             blockchain = new Polkadot();
    //             break;
    //
    //         case "unique":
    //             // TODO remake Unique Blockchain
    //             //@ts-ignore
    //             blockchain = new Unique();
    //             break;
    //
    //         case "kusama":
    //         default:
    //             blockchain = new Kusama();
    //             break;
    //     }
    //
    //     return blockchain;
    // }


    toJsonSerialize = () : BlockchainInterface => ({
        name: this.name,
        symbol: this.symbol,
        prefix: this.prefix,
        isSubstrate: this.isSubstrate,
    })

}
