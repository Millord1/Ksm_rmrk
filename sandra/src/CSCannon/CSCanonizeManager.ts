import {SandraManager} from "../SandraManager.js";
import {AssetCollectionFactory} from "./AssetCollectionFactory.js";
import {AssetCollection, AssetCollectionInterface} from "./AssetCollection.js";
import {AssetFactory} from "./AssetFactory.js";
import {Asset, AssetInterface} from "./Asset.js";
import {BlockchainTokenFactory} from "./BlockchainTokenFactory.js";
import {ContractStandardFactory} from "./ContractStandardFactory.js";

interface CanonizeOptions{

    default:string

}

export class CSCanonizeManager {

    private sandra: SandraManager;
    private assetCollectionFactory ;
    private assetFactory:AssetFactory ;
    private tokenFactory: BlockchainTokenFactory;
    private contractStandardFactory: ContractStandardFactory;

    constructor(options?:CanonizeOptions,sandra:SandraManager = new SandraManager()) {

        this.sandra = sandra ;
        this.assetCollectionFactory = new AssetCollectionFactory(sandra);
        this.assetFactory = new AssetFactory(sandra);
        this.tokenFactory = new BlockchainTokenFactory(this);
        this.contractStandardFactory = new ContractStandardFactory(sandra);


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

    public getContractStandardFactory():ContractStandardFactory{

        return this.contractStandardFactory ;

    }

    public getTokenFactory():BlockchainTokenFactory{

        return this.tokenFactory ;

    }


    public getAssetCollectionFactory():AssetCollectionFactory{

        return this.assetCollectionFactory ;

    }

    public getSandra():SandraManager{

        return this.sandra ;

    }



}