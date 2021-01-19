import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress.js";
import {Transaction} from "../../Transaction.js";

export class ChangeIssuer extends Interaction
{

    collectionId: string;
    newIssuer: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction){
        super(rmrk, ChangeIssuer.name, chain, null, transaction);

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.collectionId = splitted[3];

        // @ts-ignore
        const chainAddress = this.chain.getAddressClass();
        chainAddress.address = splitted[4];
        this.newIssuer = chainAddress;
    }

    // public createChangeIssuer(){
    //     const splitted = this.rmrkToArray();
    //
    //     this.version = splitted[2];
    //     this.collectionId = splitted[3];
    //
    //     const chainAddress = this.chain.getAddressClass();
    //     chainAddress.address = splitted[4];
    //     this.newIssuer = chainAddress;
    //
    //     return this;
    // }


    public toJson(){

        const json = this.toJsonSerialize();
        // @ts-ignore
        json['collectionId'] = this.collectionId;
        // @ts-ignore
        json['newIssuer'] = this.newIssuer;
        return JSON.stringify(json);
    }

}