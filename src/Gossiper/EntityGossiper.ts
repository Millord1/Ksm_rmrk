import {Entity} from "../Remark/Entities/Entity";
import {Asset} from "../Remark/Entities/Asset";
import {Collection} from "../Remark/Entities/Collection";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {RmrkContractStandard} from "canonizer/src/canonizer/Interfaces/RmrkContractStandard";
import {MetaData} from "../Remark/MetaData";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";
import {GossiperManager} from "./GossiperManager";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {RmrkCanonizerWrapper} from "canonizer/src/canonizer/Interfaces/Rmrk/RmrkCanonizerWrapper"

export class EntityGossiper extends GossiperManager
{

    private entityName: string;

    private readonly image: string;
    private readonly description: string;
    private readonly blockId: number;
    private readonly source: string;
    private readonly collectionId: string;
    private readonly maxSupply: number = 0;

    private readonly sn?: string;

    private readonly collection?: string;
    private readonly assetId?: string;
    private readonly assetName?: string;

    private readonly emote?: string;

    constructor(entity: Entity, blockId: number, source: string, csCanonizeManager: CSCanonizeManager, chain: Blockchain, emote?: string) {

        super(chain, csCanonizeManager);

        if(emote){
            this.emote = emote;
        }

        this.entityName = entity.constructor.name;

        // use instanceof for typescript typing
        if(entity instanceof Asset){

            this.collectionId = entity.token.collectionId;
            this.assetId = entity.contractId;
            this.assetName = entity.name;

            this.sn = entity.token.sn;

        }else if (entity instanceof Collection){

            this.collectionId = entity.contract.id;
            this.collection = entity.contract.collection;
            this.maxSupply = entity.contract.max;

        }else{
            this.collectionId = "";
        }

        this.source = source;

        // let image: string = "";
        // if(entity.metaData?.image){
        //     if(entity.metaData.image.includes('ipfs')){
        //         image = MetaData.getCloudFlareUrl(entity.metaData.image);
        //     }else{
        //         image = entity.metaData.image;
        //     }
        // }

        this.image = entity.metaData?.image ? entity.metaData.image : "";

        // this.image = entity.metaData?.image ? MetaData.getCloudFlareUrl(entity.metaData?.image) : "";
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

                let myAsset = canonizeManager.createAsset({assetId: assetId, imageUrl: this.image,description:this.description, name:assetName});

                // if(this.emote){
                //     myAsset.setEmote(this.emote);
                // }

                let myCollection = canonizeManager.createCollection({id: this.collectionId});

                myAsset.bindCollection(myCollection);
                assetContract.bindToCollection(myCollection);

                let rmrkToken = new RmrkContractStandard(canonizeManager);

                assetContract.setStandard(rmrkToken);

                myAsset.bindContract(assetContract);

                break;


            case Collection.name.toLowerCase():

                let collection: string = "";
                if(this.collection){
                    collection = this.collection;
                }

                if(!this.collectionId || !this.maxSupply){
                    break;
                }

                let myContract = this.chain.contractFactory.getOrCreate(this.collectionId);

                const source = new BlockchainAddress(this.chain.addressFactory, this.source, sandra);

                const rmrkManager = new RmrkCanonizerWrapper(canonizeManager);
                let canonizeCollection = rmrkManager.createRmrkCollection({id: this.collectionId, imageUrl: this.image, name: collection, description: this.description}, this.maxSupply, this.blockId);

                canonizeCollection.setOwner(source);

                myContract.bindToCollection(canonizeCollection);

                break;


            default:
                console.error('Something is wrong with Entity Gossip of ' + this.blockId);
        }

    }


}