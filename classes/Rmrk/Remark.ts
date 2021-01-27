import {Blockchain} from "../Blockchains/Blockchain.js";
import {Transaction} from "../Transaction.js";
import {EntityInterface} from "../Interfaces.js";
import {BlockchainContract} from "../Contract/BlockchainContract.js";


export abstract class Remark
{
    private defaultVersion = '0.1';

    public transaction: Transaction;

    public static entityObj: EntityInterface = {
        version: "",
        name: "",
        max: 0,
        symbol: "",
        id: "",
        metadata: "",
        transferable: null,
        sn: "",
        collection: "",
        instance: ""
    };

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