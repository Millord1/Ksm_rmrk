"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainEvent = void 0;
const Entity_js_1 = require("../Entity.js");
const BlockchainEventFactory_js_1 = require("./BlockchainEventFactory.js");
const Reference_js_1 = require("../Reference.js");
const Blockchain_js_1 = require("./Blockchain.js");
const BlockchainBlock_js_1 = require("./BlockchainBlock.js");
class BlockchainEvent extends Entity_js_1.Entity {
    constructor(factory, source, destination, contract, txid, timestamp, quantity, blockchain, blockId, sandra) {
        if (factory == null)
            factory = new BlockchainEventFactory_js_1.BlockchainEventFactory(blockchain, sandra);
        let txidRef = new Reference_js_1.Reference(sandra.get(Blockchain_js_1.Blockchain.TXID_CONCEPT_NAME), txid);
        super(factory, [txidRef]);
        if (typeof source == "string") {
            source = blockchain.addressFactory.getOrCreate(source);
        }
        if (typeof destination == "string") {
            destination = blockchain.addressFactory.getOrCreate(destination);
        }
        if (typeof contract == "string") {
            contract = blockchain.contractFactory.getOrCreate(contract);
        }
        this.addReference(new Reference_js_1.Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME), timestamp));
        this.addReference(new Reference_js_1.Reference(sandra.get(BlockchainEvent.QUANTITY), quantity));
        this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS, source, sandra);
        this.joinEntity(BlockchainEvent.EVENT_DESTINATION_VERB, destination, sandra);
        this.joinEntity(BlockchainEvent.EVENT_SOURCE_CONTRACT, contract, sandra);
        //create the block
        let blockchainBlock = new BlockchainBlock_js_1.BlockchainBlock(blockchain.blockFactory, blockId, timestamp, sandra);
        this.joinEntity(BlockchainEvent.EVENT_BLOCK, blockchainBlock, sandra);
        this.setTriplet(BlockchainEvent.ON_BLOCKCHAIN, blockchain.name, sandra);
    }
}
exports.BlockchainEvent = BlockchainEvent;
BlockchainEvent.EVENT_SOURCE_ADDRESS = 'source';
BlockchainEvent.EVENT_DESTINATION_VERB = 'hasSingleDestination';
BlockchainEvent.EVENT_SOURCE_CONTRACT = 'blockchainContract';
BlockchainEvent.EVENT_BLOCK_TIME = 'timestamp';
BlockchainEvent.QUANTITY = 'quantity';
BlockchainEvent.ON_BLOCKCHAIN = 'onBlockchain';
BlockchainEvent.EVENT_BLOCK = 'onBlock';
//# sourceMappingURL=BlockchainEvent.js.map