import {Interaction, NftInterface} from "./Interaction";
import {Asset} from "../Entities/Asset";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {VersionChecker} from "../VersionChecker";


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


    private nftFromMintNft(): Asset|undefined
    {
        const rmrkData = this.splitRmrk();

        const version: string = rmrkData[2];

        let nftData : NftInterface;

        try{
            nftData = JSON.parse(rmrkData[rmrkData.length-1]);

        }catch(e){
            console.error(e);
            return undefined
        }

        nftData = this.addComputedForMintNft(nftData);
        nftData = this.slugifyNftObj(nftData);

        const versionChecker = new VersionChecker(this.version);

        if(versionChecker.checkAssetVersion(nftData)){
            return new Asset(this.rmrk, this.chain, nftData, version);
        }

        return undefined;
    }

}