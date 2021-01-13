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
        _this.addReference(new Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME), timestamp));
        _this.addReference(new Reference(sandra.get(BlockchainEvent.QUANTITY), quantity));
        _this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS, source, sandra);
        _this.joinEntity(BlockchainEvent.EVENT_SOURCE_ADDRESS, destination, sandra);
        _this.joinEntity(BlockchainEvent.EVENT_SOURCE_CONTRACT, contract, sandra);
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
var Box = /** @class */ (function () {
    function Box(obj) {
        this.x = obj && obj.x || 0;
        this.y = obj && obj.y || 0;
        this.height = obj && obj.height || 0;
        this.width = obj && obj.width || 0;
    }
    return Box;
}());
