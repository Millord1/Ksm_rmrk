
import {Asset} from "../sandra/src/CSCannon/Asset.js";
import {Blockchain} from "../sandra/src/CSCannon/Blockchain.js";
import {SandraManager} from "../sandra/src/SandraManager.js";
import {AssetFactory} from "../sandra/src/CSCannon/AssetFactory.js";
import {Remark} from "./Rmrk/Remark.js";
import {Send} from "./Rmrk/Interactions/Send.js";
import {MintNft} from "./Rmrk/Interactions/MintNft.js";
import {Interaction} from "./Rmrk/Interaction.js";
import {AssetRmrk, CollectionRmrk} from "./Interfaces.js";
import {Collection} from "./Collection.js";
import {Entity} from "./Rmrk/Entity.js";
import {Asset as rmrkAsset} from "./Asset.js";
import {Mint} from "./Rmrk/Interactions/Mint.js";
import {stringToHex} from "@polkadot/util";
import {AssetCollectionFactory} from "../sandra/src/CSCannon/AssetCollectionFactory.js";
import {AssetCollection} from "../sandra/src/CSCannon/AssetCollection.js";


export class RemarkConverter
{

    private collectionToRmrk: CollectionRmrk = {
        version: "",
        name: "",
        max: 0,
        issuer: "",
        symbol: "",
        id: "",
        metadata: ""
    }

    private assetToRmrk: AssetRmrk = {
        collection: "",
        name: "",
        transferable: null,
        sn: "",
        metadata: "",
        id: ""
    }


    private computedIdSeparator: string = '-';
    private rmrkSeparator: string = '::';

    constructor() {
    }


    public createMintRemark(collection: AssetCollection, max: number, metaDataUrl: string, collectionId: string, symbol: string = ""): string
    {

        const collectionObj : CollectionRmrk = {
            version: Remark.defaultVersion,
            name: collection.getRefValue(AssetCollectionFactory.MAIN_NAME),
            max: max,
            issuer: "",
            symbol: symbol,
            id: collectionId,
            metadata: metaDataUrl
        }

        const uri = this.objToUri(collectionObj);
        const rmrk = 'rmrk' + this.rmrkSeparator + Mint.name + this.rmrkSeparator + Remark.defaultVersion + this.rmrkSeparator + uri;

        return stringToHex(rmrk);
    }


    public createSendRemark(asset: Asset, chain: Blockchain, receiver: string, sandra: SandraManager): string
    {
        const cscToRemark = this.assetRmrkFromCscAsset(asset, sandra);
        const contract = asset.getJoinedContracts();

        const blockId = contract[0].getRefValue('id');
        const blockData = blockId.split('-');
        const blockNumber: number = (blockData.length > 2) ? Number(blockData[0]) : 0;

        const computedId = this.assetInterfaceToComputedId(cscToRemark, blockNumber);

        const rmrk = 'rmrk' + this.rmrkSeparator + Send.name + this.rmrkSeparator + computedId + receiver;

        return stringToHex(rmrk);
    }


    public createMintNftRemark(asset: Asset, collection: AssetCollection, transferable: boolean = true): string
    {

        const assetRmrkObj : AssetRmrk = {
            collection: collection.getRefValue(AssetCollectionFactory.MAIN_NAME),
            name: asset.getRefValue(AssetFactory.ASSET_NAME),
            transferable: transferable,
            sn: "",
            metadata: asset.getRefValue(AssetFactory.metaDataUrl),
            id: asset.getRefValue(AssetFactory.ID)
        }

        const uri = this.objToUri(assetRmrkObj);
        const rmrk = 'rmrk' + this.rmrkSeparator + MintNft.name + this.rmrkSeparator + Remark.defaultVersion + uri;

        return stringToHex(rmrk);
    }



    public toRmrk(interaction: Interaction): string{

        if(interaction instanceof Send){

            const computedId = interaction.nft.assetId + '-' + interaction.nft.token.sn;
            const destination = interaction.transaction.destination.address;
            return 'rmrk' + this.rmrkSeparator + Send.name + this.rmrkSeparator + computedId + this.rmrkSeparator + destination;

        }else if(interaction instanceof MintNft){

            const asset = this.getObjInterfaceFromEntity(interaction.nft);
            if(asset != null){
                return 'rmrk' + this.rmrkSeparator + MintNft.name + this.rmrkSeparator + interaction.version + this.rmrkSeparator + this.objToUri(asset);
            }

        }else if(interaction instanceof Mint){

            const collection = this.getObjInterfaceFromEntity(interaction.collection);
            if(collection != null){
                return 'rmrk' + this.rmrkSeparator + Mint.name + this.rmrkSeparator + interaction.version + this.rmrkSeparator + this.objToUri(collection);
            }

        }

        return "";
    }



    public toHexRmrk(interaction: Interaction): string{
        return stringToHex(this.toRmrk(interaction));
    }



    private assetRmrkFromCscAsset(asset: Asset, sandra: SandraManager): AssetRmrk
    {

        const collection = asset.getJoinedCollections()[0];

        const cscToRemark : AssetRmrk = this.assetToRmrk;

        cscToRemark.collection = collection.getRefValue(sandra.get(AssetCollectionFactory.MAIN_NAME));
        cscToRemark.name = asset.getRefValue(sandra.get(AssetFactory.ASSET_NAME));
        cscToRemark.transferable = null;
        cscToRemark.metadata = asset.getRefValue(sandra.get(AssetFactory.metaDataUrl));
        cscToRemark.id = asset.getRefValue(sandra.get(AssetFactory.ID));

        return cscToRemark;
    }


    public getObjInterfaceFromEntity(entity: Entity): CollectionRmrk|AssetRmrk|null{

        if(entity instanceof Collection){

            const collection = this.collectionToRmrk;
            collection.version = entity.version;
            collection.name = entity.name;
            collection.max = entity.contract.max;
            collection.issuer = entity.transaction.source;
            collection.symbol = entity.contract.symbol;
            collection.id = entity.contract.id;
            collection.metadata = entity.metaDataContent?.url;

            return collection;

        }else if(entity instanceof rmrkAsset){

            const asset = this.assetToRmrk;
            asset.collection = entity.token.contractId;
            asset.name = entity.name
            asset.transferable = entity.token.transferable;
            asset.sn = entity.token.sn;
            asset.metadata = entity.metaDataContent?.url;
            asset.id = entity.assetId;

            return asset;

        }else{
            return null;
        }

    }


    private objToUri(obj: CollectionRmrk|AssetRmrk): string{
        const toEncode = JSON.stringify(obj);
        return encodeURIComponent(toEncode);
    }


    private assetInterfaceToComputedId(assetInterface: AssetRmrk, blockId: number){
        return blockId + this.computedIdSeparator + assetInterface.collection + this.computedIdSeparator + assetInterface.id + this.computedIdSeparator + assetInterface.sn;
    }


    public RemarkFromCsc(assetInterface: AssetRmrk, blockId: number, recipient: string){
        const cumputedId = this.assetInterfaceToComputedId(assetInterface, blockId);
        return 'rmrk' + this.rmrkSeparator + Send.name + this.rmrkSeparator + Remark.defaultVersion + cumputedId + this.rmrkSeparator + recipient;
    }


}