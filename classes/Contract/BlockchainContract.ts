import {BlockchainAddress} from "../Addresses/BlockchainAddress.js";
import {Collection} from "../Collection.js";
import {Blockchain} from "../Blockchains/Blockchain.js";

export abstract class BlockchainContract
{

    version: string;
    max: number;
    issuer: BlockchainAddress;
    symbol: string;
    id: string;

    chain: Blockchain;
    collection: string;


    public createContract(obj, chain: Blockchain, collection: Collection){

        this.chain = chain;
        this.collection = collection.name;

        this.version = obj.version;
        this.max = obj.max;
        this.symbol = obj.symbol;
        this.id = obj.id;

        this.issuer = (obj.issuer === null) ? null : this.chain.getAddressClass();
    }


}