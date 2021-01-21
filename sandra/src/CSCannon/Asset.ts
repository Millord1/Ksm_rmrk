import {Entity} from "../Entity.js";
import {AssetFactory} from "./AssetFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Blockchain} from "./Blockchain.js";
import {Reference} from "../Reference.js";
import {AssetCollection} from "./AssetCollection.js";

export interface AssetInterface{

    assetId: string,
    metaDatasUrl?: string,
    imgUrl?: string,


}

export class Asset extends Entity
{

   // public assetId: string;
   // public metaDatasUrl: string;
   // public imgUrl: string;
    private sandra: SandraManager;

    public constructor(factory: AssetFactory, assetInterface:AssetInterface, sandra: SandraManager) {
        super(factory);


        this.sandra = sandra ;
        this.addReference(new Reference(sandra.get(AssetFactory.ID), assetInterface.assetId));
    }


    public bindContract(contract: BlockchainContract){
        this.joinEntity(AssetFactory.tokenJoinVerb, contract, this.sandra);
    }


    public bindCollection(assetCollection: AssetCollection){
        this.joinEntity(AssetFactory.collectionJoinVerb, assetCollection, this.sandra);
    }


    public setImageUrl(imgUrl: string){
        // TODO createOrUpdateRef
      //  this.imgUrl = imgUrl;
    }

    public setMetaDatasUrl(metaDatasUrl: string){
        // TODO createOrUpdateRef
       // this.metaDatasUrl = metaDatasUrl;
    }





}