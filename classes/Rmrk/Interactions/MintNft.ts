import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";

export class MintNft extends Interaction
{
    myNft: Nft;

    constructor(rmrk: string, chain: Blockchain, signer: string){
        super(rmrk, MintNft.name, chain, null, signer);
    }

    public createMintNft(){

        // @ts-ignore
        const myNft = new Nft(this.rmrk, this.chain, null, this.signer.address);
        this.myNft = myNft.createNftFromInteraction();

        return this;
    }

    public toJson(){
        const json = this.myNft.toJson(false, true);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}