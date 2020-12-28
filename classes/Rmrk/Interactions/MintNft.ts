import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";

export class MintNft extends Interaction
{
    nft: Nft;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, MintNft.constructor.name, chain, null);
        this.createMintNft(rmrk, chain);
    }

    private createMintNft(rmrk, chain){

        const myNft = new Nft(rmrk, chain, null);
        this.nft = myNft.createNftFromInteraction();
        return this;
    }
}