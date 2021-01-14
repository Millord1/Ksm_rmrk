import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";


export class AssetFactory extends EntityFactory
{

    public is_a: string = 'blockchainAsset';
    public contained_in_file: string = 'blockchainAssetFile';

    public static ID = 'assetId';
    public static imageUrl = 'imgUrl';
    public static metaDataUrl = 'metaDataUrl';
    public static tokenJoinVerb = 'bindToContract';
    public static collectionJoinVerb = 'bindToCollection';

    public constructor(sandra: SandraManager) {
        super('blockchainAsset', 'blockchainAssetFile', sandra);
    }



}