"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStandard = void 0;
const Entity_js_1 = require("../Entity.js");
const BlockchainToken_js_1 = require("./BlockchainToken.js");
class ContractStandard extends Entity_js_1.Entity {
    constructor() {
        super(...arguments);
        this.specifierArray = new Map();
    }
    setSpecifierValue(concept, value) {
        this.specifierArray.set(concept, value);
    }
    getSpecifierArray() {
        return this.specifierArray;
    }
    generateTokenPathEntity(canonizeManager) {
        return new BlockchainToken_js_1.BlockchainToken(canonizeManager, this.getDisplayStructure());
    }
}
exports.ContractStandard = ContractStandard;
//# sourceMappingURL=ContractStandard.js.map