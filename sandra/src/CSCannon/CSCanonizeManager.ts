import {SandraManager} from "../SandraManager.js";
import {AssetCollectionFactory} from "./AssetCollectionFactory.js";
import {AssetCollection, AssetCollectionInterface} from "./AssetCollection.js";
import {AssetFactory} from "./AssetFactory.js";
import {Asset, AssetInterface} from "./Asset.js";
import {BlockchainTokenFactory} from "./BlockchainTokenFactory.js";
import {ContractStandardFactory} from "./ContractStandardFactory.js";
import {EntityFactory} from "../EntityFactory.js";
import {ApiConnector, Gossiper} from "../Gossiper.js";
import {Blockchain} from "./Blockchain.js";
import {Entity} from "../Entity.js";
import {Reference} from "../Reference.js";
import {AssetSolverFactory} from "./AssetSolvers/AssetSolverFactory.js";
import {LocalSolver} from "./AssetSolvers/LocalSolver.js";
import {AssetSolver} from "./AssetSolvers/AssetSolver.js";


interface CanonizeOptions{

    default?:string
    connector?:ApiConnector

}

export class CSCanonizeManager {

    private sandra: SandraManager;
    private assetCollectionFactory ;
    private assetFactory:AssetFactory ;
    private tokenFactory: BlockchainTokenFactory;
    private contractStandardFactory: ContractStandardFactory;
    private activeBlockchainFactory:EntityFactory;
    private apiConnector?:ApiConnector;
    private assetSolverFactory:AssetSolverFactory;
    private localSolver:LocalSolver ;

    constructor(options?:CanonizeOptions,sandra:SandraManager = new SandraManager()) {

        this.sandra = sandra ;
        this.assetCollectionFactory = new AssetCollectionFactory(sandra);
        this.assetFactory = new AssetFactory(sandra);
        this.tokenFactory = new BlockchainTokenFactory(this);
        this.contractStandardFactory = new ContractStandardFactory(sandra);

        this.assetSolverFactory = new AssetSolverFactory(this);
        this.localSolver = new LocalSolver(this);

        this.activeBlockchainFactory = new EntityFactory('activeBlockchain','activeBlockchainFile',
            this.sandra,this.sandra.get('blockchain'));

        this.apiConnector = options?.connector ? options.connector : undefined ;

    }

    public createCollection(collectionInterface:AssetCollectionInterface,solver?:AssetSolver):AssetCollection{

        let assetSolver = solver ? solver : this.localSolver ;
        let collection = new AssetCollection(this.assetCollectionFactory,collectionInterface,this.sandra);
        collection.joinEntity(AssetSolverFactory.COLLECTION_JOIN_VERB,assetSolver,this.sandra);

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

    public async gossipActiveBlockchain(apiConnector?:ApiConnector,flush?:boolean):Promise<any>{

      if (apiConnector !== undefined){
          let gossiper = new Gossiper(this.activeBlockchainFactory,this.sandra.get('blockchain'));
          let flushCall = await flush ? await gossiper.flushDatagraph(apiConnector) : null;
          return await gossiper.gossipToUrl(apiConnector);
      }

        if (this.apiConnector !== undefined){
            let gossiper = new Gossiper(this.activeBlockchainFactory,this.sandra.get('blockchain'));
            let flushCall = await flush ? await gossiper.flushDatagraph(this.apiConnector) : null;
            return await gossiper.gossipToUrl(this.apiConnector);
        }

      throw new Error("No API connector set pass it into this function or on the constructor");

    }



    public async flushWithBlockchainSupport(blockchains:Blockchain[],apiConnector?:ApiConnector):Promise<any>{

        const result = await blockchains.forEach(blockchain => {
            let entity = new Entity(this.activeBlockchainFactory,[new Reference(this.sandra.get('blockchain'),blockchain.getName())]);
            entity.setTriplet('onBlockchain',blockchain.getName(),this.sandra);
            this.activeBlockchainFactory.addOrUpdateEntity(entity);

        })

        return this.gossipActiveBlockchain(apiConnector,true)



    }

    public getAssetSolverFactory(){

        return this.assetSolverFactory ;

    }





}