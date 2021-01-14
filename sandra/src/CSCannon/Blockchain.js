"use strict";
exports.__esModule = true;
exports.Blockchain = void 0;
var BlockchainAddressFactory_js_1 = require("./BlockchainAddressFactory.js");
var BlockchainContractFactory_js_1 = require("./BlockchainContractFactory.js");
var BlockchainEventFactory_js_1 = require("./BlockchainEventFactory.js");
var Blockchain = /** @class */ (function () {
    function Blockchain(sandra) {
        this.name = 'genericBlockchain';
        this.addressFactory = new BlockchainAddressFactory_js_1.BlockchainAddressFactory(sandra);
        this.contractFactory = new BlockchainContractFactory_js_1.BlockchainContractFactory(sandra);
        this.eventFactory = new BlockchainEventFactory_js_1.BlockchainEventFactory(this, sandra);
    }
    Blockchain.TXID_CONCEPT_NAME = 'txid';
    return Blockchain;
}());
exports.Blockchain = Blockchain;
//# sourceMappingURL=Blockchain.js.map