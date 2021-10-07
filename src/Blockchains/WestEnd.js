"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WestEnd = void 0;
const RmrkBlockchain_1 = require("./RmrkBlockchain");
class WestEnd extends RmrkBlockchain_1.RmrkBlockchain {
    constructor() {
        super("WND", "", true, "wss://westend-rpc.polkadot.io/", 10);
    }
}
exports.WestEnd = WestEnd;
//# sourceMappingURL=WestEnd.js.map