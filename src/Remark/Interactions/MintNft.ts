import {Interaction, NftInterface} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {VersionChecker} from "../VersionChecker";
import {Entity} from "../Entities/Entity";


export class MintNft extends Interaction
{

    public asset?: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        const signer = this.transaction.source;
        this.transaction.source = CSCanonizeManager.mintIssuerAddressString;
        this.transaction.destination = signer;

        const asset = this.nftFromMintNft();
        if(asset){
            this.asset = asset;
        }
    }

    public getEntity(): Entity|undefined
    {
        return this.asset;
    }


}