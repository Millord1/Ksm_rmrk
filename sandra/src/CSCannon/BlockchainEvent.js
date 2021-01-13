var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Entity } from "../Entity.js";
import { BlockchainEventFactory } from "./BlockchainEventFactory.js";
import { Reference } from "../Reference.js";
import { Blockchain } from "./Blockchain.js";
var BlockchainEvent = /** @class */ (function (_super) {
    __extends(BlockchainEvent, _super);
    function BlockchainEvent(factory, source, destination, contract, txid, timestamp, quantity, blockchain, sandra) {
        var _this = this;
        if (factory == null)
            factory = new BlockchainEventFactory(blockchain, sandra);
        var txidRef = new Reference(sandra.get(Blockchain.TXID_CONCEPT_NAME), txid);
        _this = _super.call(this, factory, [txidRef]) || this;
        if (typeof source == "string") {
            source = blockchain.addressFactory.getOrCreate();
        }
        _this.addReference(new Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME), timestamp));
        _this.addReference(new Reference(sandra.get(BlockchainEvent.QUANTITY), quantity));
        _this.joinEntity(source, BlockchainEvent.EVENT_SOURCE_ADDRESS, sandra);
        _this.joinEntity(destination, BlockchainEvent.EVENT_DESTINATION_VERB, sandra);
        _this.joinEntity(contract, BlockchainEvent.EVENT_SOURCE_CONTRACT, sandra);
        return _this;
    }
    BlockchainEvent.EVENT_SOURCE_ADDRESS = 'source';
    BlockchainEvent.EVENT_DESTINATION_VERB = 'hasSingleDestination';
    BlockchainEvent.EVENT_SOURCE_CONTRACT = 'sourceBlockchainContract';
    BlockchainEvent.EVENT_BLOCK_TIME = 'timestamp';
    BlockchainEvent.QUANTITY = 'quantity';
    return BlockchainEvent;
}(Entity));
export { BlockchainEvent };
