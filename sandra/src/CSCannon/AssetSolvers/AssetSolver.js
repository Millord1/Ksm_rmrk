"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetSolver = void 0;
const Entity_js_1 = require("../../Entity.js");
const AssetSolverFactory_js_1 = require("./AssetSolverFactory.js");
class AssetSolver extends Entity_js_1.Entity {
    constructor(canonizeManager, solverId, csCannonClass) {
        let factory = canonizeManager.getAssetSolverFactory();
        super(canonizeManager.getAssetSolverFactory());
        this.createOrUpdateRef(factory.id, solverId);
        this.createOrUpdateRef(AssetSolverFactory_js_1.AssetSolverFactory.CS_CANNON_CLASS_NAME, csCannonClass);
    }
}
exports.AssetSolver = AssetSolver;
//# sourceMappingURL=AssetSolver.js.map