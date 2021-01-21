import {SandraManager} from "../SandraManager.js";
import {AssetCollectionFactory} from "./AssetCollectionFactory.js";
import {AssetCollection, AssetCollectionInterface} from "./AssetCollection.js";
import {AssetFactory} from "./AssetFactory.js";
import {Asset, AssetInterface} from "./Asset.js";

interface CanonizeOptions{

    default:string

}

export class CSCanonizeManager {

    private sandra: SandraManager;
    private assetCollectionFactory ;
    private assetFactory:AssetFactory ;

    constructor(options?:CanonizeOptions,sandra:SandraManager = new SandraManager()) {

        this.sandra = sandra ;
        this.assetCollectionFactory = new AssetCollectionFactory(sandra);
        this.assetFactory = new AssetFactory(sandra);


    }

    public createCollection(collectionInterface:AssetCollectionInterface):AssetCollection{

       return new AssetCollection(this.assetCollectionFactory,collectionInterface,this.sandra);

    }

    public createAsset(assetInterface:AssetInterface):Asset{

        return new Asset(this.assetFactory,assetInterface,this.sandra);

    }

    public getAssetFactory():AssetFactory{

        return this.assetFactory ;

    }

    public getAssetCollectionFactory():AssetCollectionFactory{

        return this.assetCollectionFactory ;

    }



}