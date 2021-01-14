import {Entity} from "../Entity.js";
import {AssetFactory} from "./AssetFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Blockchain} from "./Blockchain.js";
import {Reference} from "../Reference.js";


export class Asset extends Entity
{

    public assetId: string;
    public metaDatasUrl: string;
    public imgUrl: string;

    public constructor(factory: AssetFactory|null, assetId: string, metaDatasUrl: string, imgUrl: string, sandra: SandraManager) {
        super(factory);

        this.assetId = assetId;
        this.imgUrl = imgUrl;
        this.metaDatasUrl = metaDatasUrl;

        this.addReference(new Reference(sandra.get('asset'), assetId));
    }


    public bindContract(contract: BlockchainContract, replaceExisting: boolean = false){
        // this.joinEntity(contract, AssetFactory.tokenJoinVerb, );
    }


    public bindCollection(assetCollection){
        // this.joinEntity(assetCollection, AssetFactory.collectionJoinVerb);
    }


    public setImageUrl(imgUrl: string){
        this.imgUrl = imgUrl;
    }

    public setMetaDatasUrl(metaDatasUrl: string){
        this.metaDatasUrl = metaDatasUrl;
    }





}