"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const BlockchainContract_js_1 = require("./Contract/BlockchainContract.js");
class Token {
    constructor(transferable, sn, contract) {
        this.transferable = transferable;
        this.sn = sn;
        if (contract instanceof BlockchainContract_js_1.BlockchainContract) {
            this.contract = contract;
            this.contractId = this.contract.id;
        }
        else {
            this.contractId = contract;
        }
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map