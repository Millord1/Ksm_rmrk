"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetSolverFactory = void 0;
const EntityFactory_js_1 = require("../../EntityFactory.js");
class AssetSolverFactory extends EntityFactory_js_1.EntityFactory {
    constructor(manager) {
        super('assetSolver', 'assetSolverFile', manager.getSandra());
        this.is_a = 'assetSolver';
        this.contained_in_file = 'assetSolverFile';
        this.id = 'identifier';
        this.updateOnExistingRef = manager.getSandra().get(this.id);
        let factory = manager.getAssetSolverFactory();
    }
}
exports.AssetSolverFactory = AssetSolverFactory;
AssetSolverFactory.CS_CANNON_CLASS_NAME = 'class_name';
AssetSolverFactory.COLLECTION_JOIN_VERB = 'has';
//# sourceMappingURL=AssetSolverFactory.js.map