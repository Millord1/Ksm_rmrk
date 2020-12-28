import {BlockchainAddress} from "../Addresses/BlockchainAddress";
import {Collection} from "../Collection";
import {Blockchain} from "../Blockchains/Blockchain";

export class BlockchainContract
{

    version: string;
    max: number;
    issuer: BlockchainAddress;
    symbol: string;
    id: string;

    chain: Blockchain;
    collection: Collection;


    public createContract(obj, chain: Blockchain, collection: Collection){

        this.chain = chain;
        this.collection = collection;

        this.version = obj.version;
        this.max = obj.max;
        this.symbol = obj.symbol;
        this.id = obj.id;

        this.issuer = (obj.issuer === null) ? null : this.chain.getAddressClass();
    }


}