import {Interaction} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {Entity} from "../Entities/Entity";


export class List extends Interaction
{

    public asset?: Asset;
    public value?: number;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        const rmrkArray = this.splitRmrk();
        let value = rmrkArray.pop();

        if(value){
            this.value = Number(value);
        }

        const nft = this.assetFromComputedId(rmrkArray);
        if(nft){
            this.asset = new Asset(this.rmrk, this.chain, nft);
        }

    }

    public getEntity(): Entity|undefined
    {
        return this.asset;
    }

}