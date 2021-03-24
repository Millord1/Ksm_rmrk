import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";
import {Reference} from "../Reference.js";


export class AssetCollectionFactory extends EntityFactory
{

    public is_a: string = 'assetCollection';
    public contained_in_file: string = 'assetCollectionFile';

    public id: string = 'collectionId';

    public static IMAGE_EXTENSION: string = 'imageExtension';
    public static MAIN_IMAGE: string = 'imageUrl';
    public static MAIN_NAME: string = 'name';
    public static DESCRIPTION: string = 'descriptiopn';
    public static COLLECTION_OWNER: string = 'owner';

    public constructor(sandra: SandraManager) {
        super('assetCollection', 'assetCollectionFile', sandra);
        this.updateOnExistingRef  = sandra.get(this.id);

    }

}