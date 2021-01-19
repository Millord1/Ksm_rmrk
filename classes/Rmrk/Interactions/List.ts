import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";

export class List extends Interaction
{

    nftId: Asset;
    quantity: string;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, List.name, chain, null, transaction);

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.nftId = this.nftFromComputedId(splitted[3]);
        this.quantity = splitted[4];
    }

    // public createList(){
    //
    //     const splitted = this.rmrkToArray();
    //
    //     this.version = splitted[2];
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //     this.quantity = splitted[4];
    //
    //     return this;
    // }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false);
        // @ts-ignore
        json['quantity'] = this.quantity;

        return JSON.stringify(json);
    }

}