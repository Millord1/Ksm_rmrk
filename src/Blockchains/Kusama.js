"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kusama = void 0;
const RmrkBlockchain_1 = require("./RmrkBlockchain");
class Kusama extends RmrkBlockchain_1.RmrkBlockchain {
    constructor() {
        super("KSM", "", true, "wss://kusama-rpc.polkadot.io/", 12);
    }
}
exports.Kusama = Kusama;
//# sourceMappingURL=Kusama.js.map