
import {Blockchain} from "../Blockchains/Blockchain.js";

export class BlockchainContract
{

    max: number;
    symbol: string;
    id: string;
    chain: Blockchain;
    collection: string;


    constructor(chain: Blockchain, collection: string, id: string, symbol: string, max: number) {
        this.max = max;
        this.symbol = symbol;
        this.id = id;
        this.chain = chain;
        this.collection = collection;
    }


    // public createContract(obj: any, chain: Blockchain, collection: Collection){
    //
    //     this.chain = chain;
    //     this.collection = collection.name;
    //
    //     this.version = obj.version;
    //     this.max = obj.max;
    //     this.symbol = obj.symbol;
    //     this.id = obj.id;
    //
    //     // @ts-ignore
    //     this.issuer = (obj.issuer === null) ? undefined : this.chain.getAddressClass();
    // }


}