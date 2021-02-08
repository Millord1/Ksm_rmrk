import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";
import {Transaction} from "./Transaction.js";
import {Remark} from "./Rmrk/Remark.js";
import {EntityInterface} from "./Interfaces.js";
import {Metadata} from "./Metadata.js";


export class Collection extends Entity
{

    name: string;
    contract: BlockchainContract;

    constructor(
        rmrk: string,
        chain: Blockchain,
        version: string,
        transaction:Transaction,
        obj: EntityInterface,
        meta: Metadata|null
    ) {
        super(rmrk, Collection.name, chain, version, transaction, meta);

        this.name = obj.name;
        this.version = version;

        this.contract = new BlockchainContract(this.chain, obj.name, obj.id, obj.symbol, obj.max);
    }


    public static createCollectionFromInteraction(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null){

        const splitted = rmrk.split('::');

        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');

        const obj = Entity.dataTreatment(splitted, Remark.entityObj);

        return new Collection(rmrk, chain, obj.version, transaction, obj, meta);
    }



    public toJson(needStringify: boolean = true, needSubstrate: boolean = true){

        const json = this.toJsonSerialize();

        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);

        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['contract'] = this.contract;

        return (needStringify) ? JSON.stringify(json) : json;
    }

}