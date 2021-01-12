import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress";
import {Nft} from "../../Nft";


export class Send extends Interaction
{

    nftId: Nft;
    recipient: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain, signer: string){
        super(rmrk, Send.name, chain, null, signer);
    }

    public createSend(){

        const splitted = this.rmrkToArray();

        this.version = splitted[2];

        this.nftId = this.nftFromComputedId(splitted[3]);

        const blockchainAddress = this.chain.getAddressClass();
        blockchainAddress.address = splitted[4];
        this.recipient = blockchainAddress;

        return this;
    }


    public toJson(){

        const json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false, false);
        json['recipient'] = this.recipient;

        return JSON.stringify(json);
    }

}