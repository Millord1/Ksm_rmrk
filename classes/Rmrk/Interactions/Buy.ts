import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Nft} from "../../Nft.js";

export class Buy extends Interaction
{

    nftId: Nft;

    constructor(rmrk: string, chain: Blockchain, signer: string) {
        super(rmrk, Buy.name, chain, null, signer);
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