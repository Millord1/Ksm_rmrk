"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueContractStandard = void 0;
const Reference_js_1 = require("../../Reference.js");
const ContractStandard_js_1 = require("../ContractStandard.js");
class UniqueContractStandard extends ContractStandard_js_1.ContractStandard {
    constructor(canonizeManager, tokenTokenId) {
        let factory = canonizeManager.getContractStandardFactory();
        super(factory);
        this.sandra = canonizeManager.getSandra();
        //we need to bind the the standard to the CSCannon class
        this.addReference(new Reference_js_1.Reference(canonizeManager.getSandra().get('class_name'), "CsCannon\\\Blockchains\\\Substrate\\\Unique\\\UniqueContractStandard"));
        if (tokenTokenId) {
            this.setTokenId(tokenTokenId);
        }
    }
    getDisplayStructure() {
        return "tokenId-" + this.getTokenId();
    }
    setTokenId(value) {
        this.setSpecifierValue(this.sandra.get('tokenId'), value);
    }
    getTokenId() {
        if (!this.getSpecifierArray().get(this.sandra.get('tokenId')))
            throw new Error("tokenId not specified for unique contract");
        return this.getSpecifierArray().get(this.sandra.get('tokenId'));
    }
}
exports.UniqueContractStandard = UniqueContractStandard;
//# sourceMappingURL=UniqueContractStandard.js.map