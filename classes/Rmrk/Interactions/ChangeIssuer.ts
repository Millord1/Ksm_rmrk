import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress";

export class ChangeIssuer extends Interaction
{

    collectionId: string;
    newIssuer: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain, signer: string){
        super(rmrk, ChangeIssuer.name, chain, null, signer);
    }

    public createChangeIssuer(){
        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.collectionId = splitted[3];

        const chainAddress = this.chain.getAddressClass();
        chainAddress.address = splitted[4];
        this.newIssuer = chainAddress;

        return this;
    }


    public toJson(){

        const json = this.toJsonSerialize();
        json['collectionId'] = this.collectionId;
        json['newIssuer'] = this.newIssuer;
        return JSON.stringify(json);
    }

}