import {Entity} from "../../Entity.js";
import {AssetFactory} from "../AssetFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {Reference} from "../../Reference.js";
import {AssetInterface} from "../Asset.js";
import {CSCanonizeManager} from "../CSCanonizeManager.js";
import {AssetSolverFactory} from "./AssetSolverFactory.js";
import {AssetSolver} from "./AssetSolver.js";

export class LocalSolver extends AssetSolver{


    public constructor(canonizeManager: CSCanonizeManager) {
        let factory = canonizeManager.getAssetSolverFactory();
        super(canonizeManager,'localSolver','CsCannon\\\AssetSolvers\\\LocalSolver');




    }


}