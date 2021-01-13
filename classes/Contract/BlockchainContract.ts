import {BlockchainAddress} from "../Addresses/BlockchainAddress.js";
import {Collection} from "../Collection.js";
import {Blockchain} from "../Blockchains/Blockchain.js";

export abstract class BlockchainContract
{

    version: string | undefined;
    max: number | undefined;
    issuer: BlockchainAddress | undefined;
    symbol: string | undefined;
    id: string | undefined;

    chain: Blockchain | undefined;
    collection: string | undefined;


    public createContract(obj: any, chain: Blockchain, collection: Collection){

        this.chain = chain;
        this.collection = collection.name;

        this.version = obj.version;
        this.max = obj.max;
        this.symbol = obj.symbol;
        this.id = obj.id;

        this.issuer = (obj.issuer === null) ? undefined : this.chain.getAddressClass();
    }


}