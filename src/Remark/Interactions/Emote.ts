import {Interaction} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";


export class Emote extends Interaction
{

    public asset?: Asset;
    public unicode?: string;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        const rmrkArray: Array<string> = this.splitRmrk();
        const unicode = rmrkArray.pop();

        if(typeof unicode === "string"){
            this.unicode = unicode;
        }

        const nft = this.assetFromComputedId(rmrkArray);

        if(nft){
            this.asset =  new Asset(this.rmrk, this.chain, nft);
        }
    }

}