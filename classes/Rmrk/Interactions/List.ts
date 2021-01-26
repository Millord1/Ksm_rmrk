import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";
import {Metadata} from "../../Metadata.js";

export class List extends Interaction
{

    nft: Asset;
    quantity: string;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata) {
        super(rmrk, List.name, chain, null, transaction);

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.nft = this.nftFromComputedId(splitted[3], meta);
        this.quantity = splitted[4];
    }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false);
        // @ts-ignore
        json['quantity'] = this.quantity;

        return JSON.stringify(json);
    }

}