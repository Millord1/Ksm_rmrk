import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress";
import {Nft} from "../../Nft";


export class Send extends Interaction
{

    nftId: Nft;
    recipient: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, Send.name, chain, null);
    }

    public createSend(){

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        // this.nftId = splitted[3];

        this.nftId = this.nftFromComputedId(splitted[3]);

        // const newNft = new Nft(this.rmrk, this.chain, this.version);
        // this.nftId = newNft.createNftFromInteraction();

        const blockchainAddress = this.chain.getAddressClass();
        blockchainAddress.address = splitted[4];
        this.recipient = blockchainAddress;

        return this;
    }


    public toJson(){

        const json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false);
        json['recipient'] = this.recipient;

        return JSON.stringify(json);
    }

}