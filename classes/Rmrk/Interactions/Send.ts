import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";
import {Metadata} from "../../Metadata.js";


export class Send extends Interaction
{

    public nft: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null){
        super(rmrk, Send.name, chain, null, transaction);
        const splitted = this.rmrkToArray();

        this.version = splitted[2];

        this.nft = this.nftFromComputedId(splitted[3], meta);

        this.transaction.setDestination(this.chain.getAddressClass(splitted[4]));
    }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false, false);

        return JSON.stringify(json);
    }

}