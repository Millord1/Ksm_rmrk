import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress.js";
import {Transaction} from "../../Transaction.js";
import {Metadata} from "../../Metadata.js";

export class Consume extends Interaction
{

    nft: Asset;
    reason: string | undefined;
    // consumer: BlockchainAddress | undefined;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null) {

        super(rmrk, Consume.name, chain, null, transaction);

        const consume = this.rmrkToArray();

        if(consume[1].toLowerCase() === "consume"){
            this.version = consume[2];
            this.nft = this.nftFromComputedId(consume[3], meta);
        }else{
            this.reason = consume[1];
            this.nft = this.nftFromComputedId(consume[2], meta)

            // const consumer = this.chain.getAddressClass(transaction.source);
            // consumer.address = consume[3];
            // this.consumer = consumer;
        }
    }



    // private firstMessage(consume){
    //
    //     this.version = consume[2];
    //     this.nftToConsume = this.nftFromComputedId(consume[3]);
    //
    //     return this;
    // }
    //
    //
    // private secondMessage(consume){
    //
    //     this.reason = consume[1];
    //     this.nftToConsume = this.nftFromComputedId(consume[2])
    //
    //     const consumer = this.chain.getAddressClass();
    //     consumer.address = consume[3];
    //     this.consumer = consumer;
    //
    //     return this;
    // }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftToConsume'] = this.nftToConsume.toJson(false);
        // @ts-ignore
        json['reason'] = this.reason;
        // @ts-ignore
        json['consumer'] = this.consumer;

        return JSON.stringify(json);
    }

}