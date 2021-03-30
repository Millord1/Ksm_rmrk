"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kusama = void 0;
const Blockchain_1 = require("./Blockchain");
class Kusama extends Blockchain_1.Blockchain {
    constructor() {
        super("KSM", "", true, "wss://kusama-rpc.polkadot.io/", 12);
    }
}
exports.Kusama = Kusama;
//# sourceMappingURL=Kusama.js.map