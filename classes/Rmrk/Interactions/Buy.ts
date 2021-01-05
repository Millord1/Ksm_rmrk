import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";

export class Buy extends Interaction
{

    nftId: Nft;

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, Buy.name, chain, null);
    }

    public createBuy(){
        const splitted = this.rmrkToArray();
        this.nftId = this.nftFromComputedId(splitted[3]);
        return this;
    }


    public toJson(){

        const json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false);
        json['interaction'] = this.interaction;

        return JSON.stringify(json);
    }

}