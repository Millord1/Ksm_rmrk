import {Interaction, NftInterface} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {Entity} from "../Entities/Entity";


export class Send extends Interaction
{

    public asset?: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        this.asset = this.assetToSend();
    }

    public getEntity(): Entity|undefined
    {
        return this.asset;
    }

    private assetToSend(): Asset|undefined
    {

        const rmrkArray: Array<string> = this.splitRmrk();
        const isReceiver = rmrkArray.pop();

        if(typeof isReceiver == "string"){
            this.transaction.destination = isReceiver;
        }

        const nft = this.assetFromComputedId(rmrkArray);

        if(nft){
            return new Asset(this.rmrk, this.chain, nft);
        }

        return undefined;
    }

}