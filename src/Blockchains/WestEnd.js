"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WestEnd = void 0;
const Blockchain_1 = require("./Blockchain");
class WestEnd extends Blockchain_1.Blockchain {
    constructor() {
        super("WND", "", true, "wss://westend-rpc.polkadot.io/", 10);
    }
}
exports.WestEnd = WestEnd;
//# sourceMappingURL=WestEnd.js.map