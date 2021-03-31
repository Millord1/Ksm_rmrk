"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const BlockchainContract_1 = require("./BlockchainContract");
class Token {
    constructor(sn, contract, transferable) {
        this.sn = sn;
        this.transferable = transferable;
        if (contract instanceof BlockchainContract_1.BlockchainContract) {
            this.contract = contract;
            this.collectionId = this.contract.id;
        }
        else {
            this.collectionId = contract;
        }
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map