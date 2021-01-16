"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polkadot = void 0;
const Blockchain_js_1 = require("./Blockchain.js");
const PolkadotContract_js_1 = require("../Contract/PolkadotContract.js");
class Polkadot extends Blockchain_js_1.Blockchain {
    constructor() {
        super("Polkadot", "DOT", "", false, 'wss://rpc.polkadot.io');
    }
    toJson() {
        return this.toJsonSerialize();
    }
}
exports.Polkadot = Polkadot;
Polkadot.contractClass = PolkadotContract_js_1.PolkadotContract;
//# sourceMappingURL=Polkadot.js.map