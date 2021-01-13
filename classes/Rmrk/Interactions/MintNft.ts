import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Nft} from "../../Nft.js";

export class MintNft extends Interaction
{
    myNft: Nft;

    constructor(rmrk: string, chain: Blockchain, signer: string){
        super(rmrk, MintNft.name, chain, null, signer);
        // @ts-ignore
        const myNft = new Nft(this.rmrk, this.chain, null, this.signer.address);
        this.myNft = myNft.createNftFromInteraction();
    }

    // public createMintNft(){
    //
    //     // @ts-ignore
    //     const myNft = new Nft(this.rmrk, this.chain, null, this.signer.address);
    //     this.myNft = myNft.createNftFromInteraction();
    //
    //     return this;
    // }

    public toJson(){
        const json = this.myNft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}