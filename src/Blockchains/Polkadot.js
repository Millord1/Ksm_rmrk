"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polkadot = void 0;
const Blockchain_1 = require("./Blockchain");
class Polkadot extends Blockchain_1.Blockchain {
    constructor() {
        super("DOT", "", false, "wss://rpc.polkadot.io/", 10);
    }
}
exports.Polkadot = Polkadot;
//# sourceMappingURL=Polkadot.js.map