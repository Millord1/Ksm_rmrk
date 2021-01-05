import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";

export class List extends Interaction
{

    nftId: Nft;
    quantity;

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, List.name, chain, null);
    }

    public createList(){

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.nftId = this.nftFromComputedId(splitted[3]);
        this.quantity = splitted[4];

        return this;
    }


    public toJson(){

        const json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false);
        json['quantity'] = this.quantity;

        return JSON.stringify(json);
    }

}