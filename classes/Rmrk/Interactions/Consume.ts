import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress";

export class Consume extends Interaction
{

    nftToConsume: Nft;
    reason: null;
    consumer: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain, signer: string) {
        super(rmrk, Consume.name, chain, null, signer);
    }


    public createConsume(){

        const consume = this.rmrkToArray();
        let message;

        if(consume[1].toLowerCase() === "consume"){
            message = this.firstMessage(consume);
        }else{
            message = this.secondMessage(consume);
        }

        return message;
    }


    private firstMessage(consume){

        this.version = consume[2];
        this.nftToConsume = this.nftFromComputedId(consume[3]);

        return this;
    }


    private secondMessage(consume){

        this.reason = consume[1];
        this.nftToConsume = this.nftFromComputedId(consume[2])

        const consumer = this.chain.getAddressClass();
        consumer.address = consume[3];
        this.consumer = consumer;

        return this;
    }


    public toJson(){

        const json = this.toJsonSerialize();

        json['nftToConsume'] = this.nftToConsume.toJson(false);
        json['reason'] = this.reason;
        json['consumer'] = this.consumer;

        return JSON.stringify(json);
    }

}