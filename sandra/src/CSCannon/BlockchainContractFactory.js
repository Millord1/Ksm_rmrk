"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainContractFactory = void 0;
const EntityFactory_js_1 = require("../EntityFactory.js");
const BlockchainContract_js_1 = require("./BlockchainContract.js");
class BlockchainContractFactory extends EntityFactory_js_1.EntityFactory {
    constructor(sandra) {
        super('blockchainContract', 'blockchainContractFile', sandra);
        this.contained_in_file = 'blockchainContractFile';
        this.sandra = sandra;
        this.updateOnExistingRef = sandra.get('id');
    }
    getOrCreate(id) {
        if (this.entityByRevValMap.has(this.sandra.get('id'))) {
            let addressRefMap = this.entityByRevValMap.get(this.sandra.get('id'));
            if (addressRefMap.has(id)) {
                //address exists in factory
                // @ts-ignore
                return addressRefMap.get(id);
            }
        }
        return new BlockchainContract_js_1.BlockchainContract(this, id, this.sandra);
    }
}
exports.BlockchainContractFactory = BlockchainContractFactory;
//# sourceMappingURL=BlockchainContractFactory.js.map