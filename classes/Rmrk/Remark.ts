import {Blockchain} from "../Blockchains/Blockchain.js";
import {Transaction} from "../Transaction.js";


export abstract class Remark
{
    private defaultVersion = '0.1';

    public transaction: Transaction;

    public nft = {
        collection: null,
        name: null,
        sn: null,
        metadata: null,
        transferable: null
    };

    public collection = {
        version: null,
        name: null,
        metadata: null,
        max: null,
        symbol: null,
        id: null,

        issuer: null,
    }

    version: string;
    rmrk: string;
    chain: Blockchain;

    protected constructor(version: string|null, rmrk: string, chain: Blockchain, transaction: Transaction){

        this.rmrk = rmrk;
        this.chain = chain;

        if(version === null){
            version = this.defaultVersion;
        }

        this.transaction = transaction;

        this.version = version;
    }


}