import {Interaction} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";


export class Buy extends Interaction
{

    public asset?: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);
        this.asset = this.assetToBuy();
    }


    private assetToBuy()
    {
        const rmrkArray = this.splitRmrk();

        const nft = this.assetFromComputedId(rmrkArray);

        if(nft){
            return new Asset(this.rmrk, this.chain, nft);
        }

        return undefined;
    }


}