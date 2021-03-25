import {Entity} from "../Remark/Entities/Entity";
import {Asset} from "../Remark/Entities/Asset";
import {Collection} from "../Remark/Entities/Collection";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {RmrkContractStandard} from "canonizer/src/canonizer/Interfaces/RmrkContractStandard";
import {MetaData} from "../Remark/MetaData";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";
import {GossiperManager} from "./GossiperManager";

export class EntityGossiper extends GossiperManager
{

    private entityName: string;

    private readonly image: string;
    private readonly description: string;
    private readonly blockId: number;
    private readonly source: string;
    private readonly collectionId: string;

    private readonly collection?: string;
    private readonly assetId?: string;
    private readonly assetName?: string;

    constructor(entity: Entity, blockId: number, source: string, csCanonizeManager: CSCanonizeManager, chain: string) {

        super(chain, csCanonizeManager);

        this.entityName = entity.constructor.name;

        // use instanceof for typescript typing
        if(entity instanceof Asset){

            this.collectionId = entity.token.collectionId;
            this.assetId = entity.contractId;
            this.assetName = entity.name;

        }else if (entity instanceof Collection){

            this.collectionId = entity.contract.id;
            this.collection = entity.contract.collection;

        }else{
            this.collectionId = "";
        }

        this.source = source;
        this.image = entity.metaData?.image ? MetaData.getCloudFlareUrl(entity.metaData?.image) : "";
        this.description = entity.metaData?.description ? entity.metaData.description : "No description";
        this.blockId = blockId;
    }



    public async gossip()
    {
        const canonizeManager = this.canonizeManager;
        const sandra = canonizeManager.getSandra();

        switch(this.entityName.toLowerCase()){

            case Asset.name.toLowerCase():

                let assetId: string = "";
                if(this.assetId){
                    assetId = this.assetId
                }

                let assetName: string = "";
                if(this.assetName){
                    assetName = this.assetName;
                }

                let assetContract = this.chain.contractFactory.getOrCreate(assetId);
                const source = new BlockchainAddress(this.chain.addressFactory, this.source, sandra);

                let myAsset = canonizeManager.createAsset({assetId: assetId, imageUrl: this.image,description:this.description, name:assetName});
                let myCollection = canonizeManager.createCollection({id: this.collectionId});
                myCollection.setOwner(source);

                myAsset.bindCollection(myCollection);
                assetContract.bindToCollection(myCollection);

                let rmrkToken = new RmrkContractStandard(canonizeManager);
                assetContract.setStandard(rmrkToken);

                myAsset.bindContract(assetContract);

                canonizeManager.gossipOrbsBindings().then(()=>{console.log("asset gossiped " + this.blockId)});

                break;


            case Collection.name.toLowerCase():

                let collection: string = "";
                if(this.collection){
                    collection = this.collection;
                }

                let myContract = this.chain.contractFactory.getOrCreate(this.collectionId);

                let canonizeCollection = canonizeManager.createCollection({id: this.collectionId, imageUrl: this.image, name: collection, description: this.description});

                myContract.bindToCollection(canonizeCollection);

                canonizeManager.gossipCollection().then(()=>{console.log("collection gossiped " + this.blockId)});

                break;


            default:
                console.error('Something is wrong with Entity Gossip of ' + this.blockId);
                break;
        }

    }


}