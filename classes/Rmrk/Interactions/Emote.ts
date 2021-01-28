import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Transaction} from "../../Transaction.js";
import {Asset} from "../../Asset.js";
import {Metadata} from "../../Metadata.js";


export class Emote extends Interaction
{
    public nft: Asset;
    public unicode: string;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null) {
        super(rmrk, Emote.name, chain, null, transaction);

        const splittedRmrk = this.rmrkToArray();

        this.version = splittedRmrk[2];
        this.nft = this.nftFromComputedId(splittedRmrk[3], meta);

        this.unicode = splittedRmrk[4];
    }

}