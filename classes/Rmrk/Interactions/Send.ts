import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";


export class Send extends Interaction
{

    nftId: Asset;
    // recipient: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction){
        super(rmrk, Send.name, chain, null, transaction);
        const splitted = this.rmrkToArray();

        this.version = splitted[2];

        this.nftId = this.nftFromComputedId(splitted[3]);

        // // @ts-ignore
        // const blockchainAddress = this.chain.getAddressClass(this.transaction.source.address);
        // blockchainAddress.address = splitted[4];
        // this.recipient = blockchainAddress;
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