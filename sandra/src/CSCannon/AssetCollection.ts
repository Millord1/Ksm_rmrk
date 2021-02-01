import {Entity} from "../Entity.js";
import {AssetCollectionFactory} from "./AssetCollectionFactory.js";
import {Reference} from "../Reference.js";
import {SandraManager} from "../SandraManager.js";
import {AssetFactory} from "./AssetFactory.js";


export interface AssetCollectionInterface{

    id: string,
    name?: string,
    imageUrl?: string,
    description?: string,

}

export class AssetCollection extends Entity
{



    //canonical vocabulary
    public COLLECTION_ID:string = 'collectionId';
    public NAME:string = 'name';
    public MAIN_IMAGE:string = 'imageUrl';
    public MAIN_NAME:string = 'name';
    public DESCRIPTION:string = 'description';


    public constructor(factory: AssetCollectionFactory, collectionInterface:AssetCollectionInterface, sandra: SandraManager) {
        super(factory);


        this.addReference(new Reference(sandra.get(this.COLLECTION_ID), collectionInterface.id ));
        collectionInterface.name ? this.addReference(new Reference(sandra.get(this.NAME), collectionInterface.name )) : null;
        collectionInterface.imageUrl ? this.addReference(new Reference(sandra.get(this.MAIN_IMAGE), collectionInterface.imageUrl )): null;
        collectionInterface.description ? this.addReference(new Reference(sandra.get(this.DESCRIPTION), collectionInterface.description )): null;
    }

    public getImageUrl():string
    {
        return this.getRefValue(this.MAIN_IMAGE) ? this.getRefValue(this.MAIN_IMAGE) : '' ;

    }

    public getName():string
    {
        return this.getRefValue(this.NAME) ? this.getRefValue(this.NAME) : '' ;

    }

    public getDescription():string
    {
        return this.getRefValue(this.DESCRIPTION) ? this.getRefValue(this.DESCRIPTION) : '' ;

    }

}