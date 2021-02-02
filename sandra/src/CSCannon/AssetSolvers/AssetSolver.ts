import {Entity} from "../../Entity.js";
import {AssetFactory} from "../AssetFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {Reference} from "../../Reference.js";
import {AssetInterface} from "../Asset.js";
import {CSCanonizeManager} from "../CSCanonizeManager.js";
import {AssetSolverFactory} from "./AssetSolverFactory.js";

export class AssetSolver extends Entity{


    public constructor(canonizeManager: CSCanonizeManager,solverId:string,csCannonClass:string) {
        let factory = canonizeManager.getAssetSolverFactory();
        super(canonizeManager.getAssetSolverFactory());


        this.createOrUpdateRef(factory.id,solverId);
        this.createOrUpdateRef(AssetSolverFactory.CS_CANNON_CLASS_NAME,csCannonClass);

    }


}