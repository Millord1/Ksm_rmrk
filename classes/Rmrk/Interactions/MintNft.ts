import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";

export class MintNft extends Interaction
{
    myNft: Nft;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, MintNft.name, chain, null);
    }

    public createMintNft(){

        const myNft = new Nft(this.rmrk, this.chain, null);
        this.myNft = myNft.createNftFromInteraction();

        return this;
    }
}