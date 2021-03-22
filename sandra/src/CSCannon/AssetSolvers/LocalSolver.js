"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalSolver = void 0;
const AssetSolver_js_1 = require("./AssetSolver.js");
class LocalSolver extends AssetSolver_js_1.AssetSolver {
    constructor(canonizeManager) {
        let factory = canonizeManager.getAssetSolverFactory();
        super(canonizeManager, 'localSolver', 'CsCannon\\\AssetSolvers\\\LocalSolver');
    }
}
exports.LocalSolver = LocalSolver;
//# sourceMappingURL=LocalSolver.js.map