import {EntityFactory} from "../../EntityFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {CSCanonizeManager} from "../CSCanonizeManager.js";


export class AssetSolverFactory extends EntityFactory
{

    public is_a: string = 'assetSolver';
    public contained_in_file: string = 'assetSolverFile';

    public id: string = 'identifier';
    public static CS_CANNON_CLASS_NAME = 'class_name';
    public static COLLECTION_JOIN_VERB = 'has';



    public constructor(manager: CSCanonizeManager) {
        super('assetSolver', 'assetSolverFile', manager.getSandra());
        this.updateOnExistingRef  = manager.getSandra().get(this.id);
        let factory = manager.getAssetSolverFactory();





    }

}