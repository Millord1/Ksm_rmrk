"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
class Transaction {
    constructor(blockId, txHash, timestamp, chain, source, destination, value) {
        this.blockId = blockId;
        this.txHash = txHash;
        this.timestamp = timestamp;
        this.source = source;
        this.chain = chain;
        if (destination === undefined) {
            this.destination = CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString;
        }
        else {
            this.destination = destination;
        }
        this.value = value;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map