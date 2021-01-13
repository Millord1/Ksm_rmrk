import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress.js";
import {Nft} from "../../Nft.js";


export class Send extends Interaction
{

    nftId: Nft;
    recipient: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain, signer: string){
        super(rmrk, Send.name, chain, null, signer);
        const splitted = this.rmrkToArray();

        this.version = splitted[2];

        this.nftId = this.nftFromComputedId(splitted[3]);

        const blockchainAddress = this.chain.getAddressClass();
        blockchainAddress.address = splitted[4];
        this.recipient = blockchainAddress;
    }

    // public createSend(){
    //
    //     const splitted = this.rmrkToArray();
    //
    //     this.version = splitted[2];
    //
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //
    //     const blockchainAddress = this.chain.getAddressClass();
    //     blockchainAddress.address = splitted[4];
    //     this.recipient = blockchainAddress;
    //
    //     return this;
    // }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false, false);
        // @ts-ignore
        json['recipient'] = this.recipient;

        return JSON.stringify(json);
    }

}