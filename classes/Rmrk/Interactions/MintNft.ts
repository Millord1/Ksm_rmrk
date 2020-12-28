import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Nft} from "../../Nft";

export class MintNft extends Interaction
{
    nft: Nft;

    constructor(rmrk: string, nft: Nft, chain: Blockchain){
        super(rmrk, MintNft.constructor.name, chain, null);
        this.nft = nft;
    }
}