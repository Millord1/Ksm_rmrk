"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(blockchain, blockId, txHash, timestamp, source, destination) {
        this.blockId = blockId;
        this.txHash = txHash;
        this.timestamp = timestamp;
        this.source = source;
        this.blockchain = blockchain;
        let receiver;
        if (destination === null) {
            receiver = this.blockchain.getAddressClass('0x0');
        }
        else {
            receiver = destination;
        }
        this.destination = receiver;
    }
    setDestination(destination) {
        this.destination = destination;
        return this;
    }
    setTransferValue(value) {
        this.transferValue = value;
    }
    setTransferDest(destination) {
        this.transferDestination = destination;
    }
    static createTransaction(signer, receiver, chain) {
        const destination = chain.getAddressClass(receiver);
        return new Transaction(chain, 0, '0', '0', signer, destination);
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map