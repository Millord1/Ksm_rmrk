import {Entity} from "../Entity.js";
import {AssetFactory} from "./AssetFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Blockchain} from "./Blockchain.js";
import {Reference} from "../Reference.js";
import {AssetCollection} from "./AssetCollection.js";


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


    public bindContract(contract: BlockchainContract, sandra: SandraManager){
        this.joinEntity(AssetFactory.tokenJoinVerb, contract, sandra);
    }


    public bindCollection(assetCollection: AssetCollection, sandra:SandraManager){
        this.joinEntity(AssetFactory.collectionJoinVerb, assetCollection, sandra);
    }


    public setImageUrl(imgUrl: string){
        // TODO createOrUpdateRef
        this.imgUrl = imgUrl;
    }

    public setMetaDatasUrl(metaDatasUrl: string){
        // TODO createOrUpdateRef
        this.metaDatasUrl = metaDatasUrl;
    }





}