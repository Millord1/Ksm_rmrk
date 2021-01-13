import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Nft} from "../../Nft.js";

export class List extends Interaction
{

    nftId: Nft;
    quantity;

    constructor(rmrk: string, chain: Blockchain, signer: string) {
        super(rmrk, List.name, chain, null, signer);
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