"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainAddressFactory = void 0;
const EntityFactory_js_1 = require("../EntityFactory.js");
const BlockchainAddress_js_1 = require("./BlockchainAddress.js");
class BlockchainAddressFactory extends EntityFactory_js_1.EntityFactory {
    constructor(sandra) {
        super('blockchainAddress', 'blockchainAddressFile', sandra);
        this.is_a = 'blockchainAddress';
        this.contained_in_file = 'blockchainAddressFile';
        this.sandra = sandra;
        this.updateOnExistingRef = sandra.get('address');
    }
    getOrCreate(address) {
        if (this.entityByRevValMap.has(this.sandra.get('address'))) {
            let addressRefMap = this.entityByRevValMap.get(this.sandra.get('address'));
            // @ts-ignore
            if (addressRefMap.has(address)) {
                //address exists in factory
                // @ts-ignore
                return addressRefMap.get(address)[0];
            }
        }
        return new BlockchainAddress_js_1.BlockchainAddress(this, address, this.sandra);
    }
}
exports.BlockchainAddressFactory = BlockchainAddressFactory;
//# sourceMappingURL=BlockchainAddressFactory.js.map