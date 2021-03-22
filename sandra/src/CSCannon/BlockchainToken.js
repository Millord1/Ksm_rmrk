"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainToken = void 0;
const Entity_js_1 = require("../Entity.js");
const BlockchainTokenFactory_js_1 = require("./BlockchainTokenFactory.js");
const Reference_js_1 = require("../Reference.js");
const BlockchainContractFactory_js_1 = require("./BlockchainContractFactory.js");
class BlockchainToken extends Entity_js_1.Entity {
    constructor(canonizeManager, code) {
        super(canonizeManager.getTokenFactory(), [new Reference_js_1.Reference(canonizeManager.getSandra().get(BlockchainTokenFactory_js_1.BlockchainTokenFactory.ID), code)]);
    }
    bindToAssetWithContract(contract, asset) {
        let sandra = contract.factory.sandraManager;
        this.factory.joinFactory(contract.factory, 'self');
        this.joinEntity(contract.subjectConcept.shortname, asset, this.factory.sandraManager);
        //we need to specify for that contract that asset are bound not only on the contract but with explicit tokenpath
        contract.addReference(new Reference_js_1.Reference(sandra.get(BlockchainContractFactory_js_1.BlockchainContractFactory.EXPLICIT_TOKEN_LISTING_SHORTNAME), '1'));
        //this.setTriplet(contract.subjectConcept.shortname, tokenPath, this.sandra);
    }
}
exports.BlockchainToken = BlockchainToken;
//# sourceMappingURL=BlockchainToken.js.map