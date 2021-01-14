import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";

export class Buy extends Interaction
{

    nftId: Asset;

    constructor(rmrk: string, chain: Blockchain, signer: string) {
        super(rmrk, Buy.name, chain, null, signer);
        const splitted = this.rmrkToArray();
        this.nftId = this.nftFromComputedId(splitted[3]);
    }

    // public createBuy(){
    //     const splitted = this.rmrkToArray();
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //     return this;
    // }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false);
        json['interaction'] = this.interaction;

        return JSON.stringify(json);
    }

}