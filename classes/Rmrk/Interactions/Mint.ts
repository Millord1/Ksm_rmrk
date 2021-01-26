import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Collection} from "../../Collection.js";
import {Transaction} from "../../Transaction.js";
import {Metadata} from "../../Metadata.js";

export class Mint extends Interaction
{

    collection: Collection;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata){
        super(rmrk, Mint.name, chain, null, transaction);
        this.collection = Collection.createCollectionFromInteraction(rmrk, chain, transaction, meta);
    }


    public toJson(){
        const json = this.collection.toJson(false);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}