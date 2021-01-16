"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const BlockchainAddressFactory_js_1 = require("./BlockchainAddressFactory.js");
const BlockchainContractFactory_js_1 = require("./BlockchainContractFactory.js");
const BlockchainEventFactory_js_1 = require("./BlockchainEventFactory.js");
const EntityFactory_js_1 = require("../EntityFactory.js");
const BlockchainBlock_js_1 = require("./BlockchainBlock.js");
class Blockchain {
    constructor(sandra, name = 'genericBlockchain') {
        this.name = 'genericBlockchain';
        this.name = name;
        this.addressFactory = new BlockchainAddressFactory_js_1.BlockchainAddressFactory(sandra);
        this.contractFactory = new BlockchainContractFactory_js_1.BlockchainContractFactory(sandra);
        this.eventFactory = new BlockchainEventFactory_js_1.BlockchainEventFactory(this, sandra);
        this.blockFactory = new EntityFactory_js_1.EntityFactory(this.getName() + "Block", "blockchainBlocFile", sandra, sandra.get(BlockchainBlock_js_1.BlockchainBlock.INDEX_SHORTNAME));
    }
    getName() {
        console.log("geeeering name" + this.name);
        return this.name;
    }
}
exports.Blockchain = Blockchain;
Blockchain.TXID_CONCEPT_NAME = 'txId';
//# sourceMappingURL=Blockchain.js.map