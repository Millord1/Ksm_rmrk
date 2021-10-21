"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unique = void 0;
const GenericBlockchain_1 = require("./GenericBlockchain");
class Unique extends GenericBlockchain_1.GenericBlockchain {
    constructor() {
        // const firstTestNet: string = "wss://unique.usetech.com";
        const testNet = "wss://testnet2.unique.network";
        super("UNQ", "", true, testNet, 15);
    }
}
exports.Unique = Unique;
//# sourceMappingURL=Unique.js.map