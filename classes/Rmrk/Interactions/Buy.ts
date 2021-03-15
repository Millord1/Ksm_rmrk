import {Transaction} from "../../Transaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Interaction} from "../Interaction.js";
import {Metadata} from "../../Metadata.js";

export class Buy extends Interaction
{

    // TODO in Buy batch, the second part is send of KSM but isn't rmrk so is ignored

    nft: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null) {
        super(rmrk, Buy.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        this.nft = this.nftFromComputedId(splitted[3], meta);
    }




    // public toJson(){
    //
    //     const json = this.toJsonSerialize();
    //     // @ts-ignore
    //     json['nftId'] = this.nft.toJson(false);
    //     json['interaction'] = this.interaction;
    //
    //     return JSON.stringify(json);
    // }

}