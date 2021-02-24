import {Entity} from "../Entity.js";
import {AssetFactory} from "./AssetFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Blockchain} from "./Blockchain.js";
import {Reference} from "../Reference.js";
import {AssetCollection} from "./AssetCollection.js";
import {BlockchainToken} from "./BlockchainToken.js";

export interface AssetInterface{

    assetId: string,
    metadataUrl?: string,
    imageUrl?: string,
    description?:string,
    name?:string,


}

export class Asset extends Entity
{

    private sandra: SandraManager;

    public constructor(factory: AssetFactory, assetInterface:AssetInterface, sandra: SandraManager) {
        super(factory);

        this.sandra = sandra ;
        this.addReference(new Reference(sandra.get(AssetFactory.ID), assetInterface.assetId));
        assetInterface.imageUrl ? this.addReference(new Reference(sandra.get(AssetFactory.imageUrl), assetInterface.imageUrl)) : null ;
        assetInterface.metadataUrl ? this.addReference(new Reference(sandra.get(AssetFactory.metaDataUrl), assetInterface.metadataUrl)) : null ;
        assetInterface.description? this.addReference(new Reference(sandra.get(AssetFactory.description), assetInterface.description)) : null ;
        assetInterface.name? this.addReference(new Reference(sandra.get(AssetFactory.ASSET_NAME), assetInterface.name)) : null ;

    }


    public bindContract(contract: BlockchainContract){
        this.joinEntity(AssetFactory.tokenJoinVerb, contract, this.sandra, [new Reference(this.sandra.get('sn'),'canonizer')]);
    }


    public getJoinedContracts():BlockchainContract[]{

        // @ts-ignore
        return this.getJoinedEntitiesOnVerb(AssetFactory.tokenJoinVerb)
    }

    public getJoinedCollections():AssetCollection[]{

        // @ts-ignore
        return this.getJoinedEntitiesOnVerb(AssetFactory.collectionJoinVerb)
    }

    public bindCollection(assetCollection: AssetCollection){
        this.joinEntity(AssetFactory.collectionJoinVerb, assetCollection, this.sandra);
    }


    public getImageUrl(){
       return this.getRefValue(AssetFactory.imageUrl);
    }



    public setImageUrl(imgUrl: string){
       this.createOrUpdateRef(AssetFactory.imageUrl,imgUrl);
    }

    public getId(){
        return this.getRefValue(AssetFactory.ID);
    }

    public getDescription(){
        return this.getRefValue(AssetFactory.description);
    }

    public setDescription(description:string){
        return this.getRefValue(AssetFactory.description);
    }




    public setMetaDatasUrl(metaDatasUrl: string){
        // TODO createOrUpdateRef
       // this.metaDatasUrl = metaDatasUrl;
    }





}