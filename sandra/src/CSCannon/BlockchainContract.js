"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainContract = void 0;
const Entity_js_1 = require("../Entity.js");
const Reference_js_1 = require("../Reference.js");
const BlockchainContractFactory_js_1 = require("./BlockchainContractFactory.js");
class BlockchainContract extends Entity_js_1.Entity {
    constructor(factory, id, sandraManager) {
        if (factory == null)
            factory = new BlockchainContractFactory_js_1.BlockchainContractFactory(sandraManager);
        super(factory);
        this.addReference(new Reference_js_1.Reference(sandraManager.get('id'), id));
    }
}
exports.BlockchainContract = BlockchainContract;
//# sourceMappingURL=BlockchainContract.js.map