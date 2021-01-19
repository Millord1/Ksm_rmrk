import {SandraManager} from "../SandraManager.js";
import {AssetCollectionFactory} from "./AssetCollectionFactory.js";
import {AssetCollection, AssetCollectionInterface} from "./AssetCollection.js";

interface CanonizeOptions{

    default:string

}

export class CSCanonizeManager {

    private sandra: SandraManager;
    private assetCollectionFactory ;

    constructor(options?:CanonizeOptions,sandra:SandraManager = new SandraManager()) {

        this.sandra = sandra ;
        this.assetCollectionFactory = new AssetCollectionFactory(sandra);


    }

    public createCollection(collectionInterface:AssetCollectionInterface):AssetCollection{

       return new AssetCollection(this.assetCollectionFactory,collectionInterface,this.sandra);

    }

    public getAssetCollectionFactory():AssetCollectionFactory{

        return this.assetCollectionFactory ;

    }



}