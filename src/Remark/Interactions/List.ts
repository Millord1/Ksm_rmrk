import {Interaction} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";


export class List extends Interaction
{

    public asset?: Asset;
    public value?: string;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        const rmrkArray = this.splitRmrk();
        const value = rmrkArray.pop();

        if(typeof value === "string"){
            this.value = value;
        }

        const nft = this.assetFromComputedId(rmrkArray);
        if(nft){
            this.asset = new Asset(this.rmrk, this.chain, nft);
        }

    }

}