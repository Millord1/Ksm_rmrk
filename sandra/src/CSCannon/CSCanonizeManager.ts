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
import {BlockchainEventFactory} from "./BlockchainEventFactory.js";


interface CanonizeOptions{

    default?:string
    connector?:ApiConnector

}

export class CSCanonizeManager {

    private sandra: SandraManager;
    private assetCollectionFactory:AssetCollectionFactory ;
    private assetFactory:AssetFactory ;
    private tokenFactory: BlockchainTokenFactory;
    private contractStandardFactory: ContractStandardFactory;
    private activeBlockchainFactory:EntityFactory;
    private apiConnector?:ApiConnector;
    private assetSolverFactory:AssetSolverFactory;
    private localSolver:LocalSolver ;
    public static  mintIssuerAddressString:string = '0x0000000000000000000000000000000000000000' ;

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


    public async gossipCollection(apiConnector?:ApiConnector){

        let gossiper = new Gossiper(this.assetCollectionFactory);
        return   gossiper.gossipToUrl(this.getApiConnector(apiConnector))

    }

    public async gossipOrbsBindings(apiConnector?:ApiConnector){

        let gossiper = null ;
        //if the asset are bound directely to token we are going to dispatch that.
        if (this.tokenFactory.entityArray.length > 0){
            console.log("There are token binding so we are publishing token binding")
             gossiper = new Gossiper(this.tokenFactory);
        }
        else{
            console.log("No token binding assets may be bound directely to contract")
             gossiper = new Gossiper(this.assetFactory);
        }


        return   gossiper.gossipToUrl(this.getApiConnector(apiConnector))

    }

    public async gossipBlockchainEvents(blockchain:Blockchain ,apiConnector?:ApiConnector){
        let gossiper = new Gossiper(blockchain.eventFactory);
        return   gossiper.gossipToUrl(this.getApiConnector(apiConnector))

    }

    private getApiConnector(apiConnector?:ApiConnector){

        if (apiConnector !== undefined){
            return apiConnector ;
        }

        if (this.apiConnector !== undefined){
            return this.apiConnector ;
        }

        throw new Error("No API connector set pass it into this function or on the constructor");



    }





}