"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WestEnd = void 0;
const SubstrateChain_1 = require("./SubstrateChain");
class WestEnd extends SubstrateChain_1.SubstrateChain {
    constructor() {
        super("Westend", "WND", "", true, "wss://westend-rpc.polkadot.io");
    }
}
exports.WestEnd = WestEnd;
//# sourceMappingURL=WestEnd.js.map