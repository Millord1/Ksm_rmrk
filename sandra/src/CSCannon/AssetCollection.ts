import {Entity} from "../Entity.js";
import {AssetCollectionFactory} from "./AssetCollectionFactory.js";
import {Reference} from "../Reference.js";
import {SandraManager} from "../SandraManager.js";
import {AssetFactory} from "./AssetFactory.js";



export class AssetCollection extends Entity
{

    public ID: string = 'collectionId';
    public name: string = 'name';
    public imageUrl: string = 'imageUrl';
    public description: string = 'description';


    public constructor(factory: AssetCollectionFactory, collectionId: string, name: string, imageUrl: string, description: string, sandra: SandraManager) {
        super(factory);

        this.ID = collectionId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;

        this.addReference(new Reference(sandra.get('assetCollection'), collectionId));
    }


    public joinCollection(assetCollection: AssetCollection, sandra: SandraManager){
        this.joinEntity(assetCollection, AssetFactory.collectionJoinVerb, sandra);
    }


}