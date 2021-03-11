
import {Asset} from "./sandra/src/CSCannon/Asset.js";
import {Blockchain} from "./sandra/src/CSCannon/Blockchain.js";
import {SandraManager} from "./sandra/src/SandraManager.js";
import {AssetFactory} from "./sandra/src/CSCannon/AssetFactory.js";
import {AssetCollection} from "./sandra/src/CSCannon/AssetCollection.js";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract.js";
import {AssetCollectionFactory} from "./sandra/src/CSCannon/AssetCollectionFactory";


interface AssetRmrk
{
    collection: string,
    name: string,
    transferable: boolean|null,
    sn: string,
    metadata: string|undefined,
    id: string
}


interface CollectionRmrk
{
    version: string,
    name: string,
    max: number,
    issuer: string,
    symbol: string,
    id: string,
    metadata: string|undefined
}


export class RemarkConverter
{

    private sandra: SandraManager;

    private computedIdSeparator: string = '-';
    private rmrkSeparator: string = '::';
    private rmrkDefaultVersion: string = '1.0.0';



    constructor(sandra: SandraManager) {
        this.sandra = sandra;
    }



    public createMintRemark(collection: AssetCollection, max: number, metaDataUrl: string, collectionId: string, symbol: string = ""): string
    {

        const collectionObj : CollectionRmrk = {
            version: this.rmrkDefaultVersion,
            name: collection.getRefValue(AssetCollectionFactory.MAIN_NAME),
            max: max,
            issuer: "",
            symbol: symbol,
            id: collectionId,
            metadata: metaDataUrl
        }

        const uri = this.objToUri(collectionObj);

        return 'rmrk' + this.rmrkSeparator + 'Mint' + this.rmrkSeparator + this.rmrkDefaultVersion + this.rmrkSeparator + uri;
    }




    public createSendRemark(asset: Asset, contract: BlockchainContract, chain: Blockchain, serialNumber: string, receiver: string): string
    {
        const cscToRemark = this.assetRmrkFromCscAsset(asset, serialNumber);

        const blockId = contract.getRefValue('id');
        const blockData = blockId.split('-');
        const blockNumber: number = (blockData.length > 2) ? Number(blockData[0]) : 0;

        const computedId = this.assetInterfaceToComputedId(cscToRemark, blockNumber);

        return 'rmrk' + this.rmrkSeparator + 'Send' + this.rmrkSeparator + this.rmrkDefaultVersion + this.rmrkSeparator + computedId + this.computedIdSeparator + receiver;
    }





    public createMintNftRemark(asset: Asset, collection: AssetCollection, serialNumber: string, transferable: boolean = true): string
    {

        const assetRmrkObj : AssetRmrk = {
            collection: collection.getRefValue(AssetCollectionFactory.MAIN_NAME),
            name: asset.getRefValue(AssetFactory.ASSET_NAME),
            transferable: transferable,
            sn: serialNumber,
            metadata: asset.getRefValue(AssetFactory.metaDataUrl),
            id: asset.getRefValue(AssetFactory.ID)
        }

        const uri = this.objToUri(assetRmrkObj);

        return 'rmrk' + this.rmrkSeparator + 'MintNft' + this.rmrkSeparator + this.rmrkDefaultVersion + this.rmrkSeparator + uri;
    }




    private assetRmrkFromCscAsset(asset: Asset, serialNumber: string): AssetRmrk
    {

        const collection = asset.getJoinedCollections()[0];

        const cscToRemark : AssetRmrk = {
            collection : collection.getRefValue(this.sandra.get(AssetCollectionFactory.MAIN_NAME)),
            name : asset.getRefValue(this.sandra.get(AssetFactory.ASSET_NAME)),
            transferable : null,
            metadata : asset.getRefValue(this.sandra.get(AssetFactory.metaDataUrl)),
            sn: serialNumber,
            id : asset.getRefValue(this.sandra.get(AssetFactory.ID))
        };

        return cscToRemark;
    }



    private objToUri(obj: CollectionRmrk|AssetRmrk): string{
        const toEncode = JSON.stringify(obj);
        return encodeURIComponent(toEncode);
    }


    private assetInterfaceToComputedId(assetInterface: AssetRmrk, blockId: number){
        return blockId + this.computedIdSeparator + assetInterface.collection + this.computedIdSeparator + assetInterface.id + this.computedIdSeparator + assetInterface.sn;
    }


}