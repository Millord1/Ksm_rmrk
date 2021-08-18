import {Interaction} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {Entity} from "../Entities/Entity";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";


export class Consume extends Interaction
{
    public asset?: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        this.transaction.destination = CSCanonizeManager.mintIssuerAddressString;

        const asset = this.nftFromComputedVOne(rmrk.split('::'));
        if(asset){
            this.asset = new Asset(rmrk, this.chain, asset);
        }
    }

    public getEntity(): Entity | undefined {
        return this.asset;
    }

}