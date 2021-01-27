import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";
import {Metadata} from "../../Metadata.js";


export class MintNft extends Interaction
{
    nft: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null){
        super(rmrk, MintNft.name, chain, null, transaction);
        this.nft = Asset.createNftFromInteraction(rmrk,chain,transaction, meta);

    }

    public toJson(){
        const json = this.nft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }

}