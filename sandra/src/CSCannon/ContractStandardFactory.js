"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStandardFactory = void 0;
const EntityFactory_js_1 = require("../EntityFactory.js");
class ContractStandardFactory extends EntityFactory_js_1.EntityFactory {
    constructor(sandra) {
        super('blockchainContract', 'blockchainStandardFile', sandra);
        this.is_a = 'blockchainStandard';
        this.contained_in_file = 'blockchainStandardFile';
        this.updateOnExistingRef = sandra.get('class_name');
    }
}
exports.ContractStandardFactory = ContractStandardFactory;
//# sourceMappingURL=ContractStandardFactory.js.map