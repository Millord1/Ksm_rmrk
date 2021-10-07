"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polkadot = void 0;
const RmrkBlockchain_1 = require("./RmrkBlockchain");
class Polkadot extends RmrkBlockchain_1.RmrkBlockchain {
    constructor() {
        super("DOT", "", false, "wss://rpc.polkadot.io/", 10);
    }
}
exports.Polkadot = Polkadot;
//# sourceMappingURL=Polkadot.js.map