import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";


export class AssetFactory extends EntityFactory
{

    public is_a: string = 'blockchainizableAsset';
    public contained_in_file: string = 'blockchainizableAssets';

    public static ID = 'assetId';
    public static imageUrl = 'imgUrl';
    public static metaDataUrl = 'metaDataUrl';
    public static tokenJoinVerb = 'bindToContract';
    public static collectionJoinVerb = 'bindToCollection';
    public static description = 'description';
    public static ASSET_NAME = 'name';

    public constructor(sandra: SandraManager) {
        super('blockchainAsset', 'blockchainAssetFile', sandra);

        this.updateOnExistingRef  = sandra.get(AssetFactory.ID);
    }



}