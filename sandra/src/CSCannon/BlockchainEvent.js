"use strict";
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
exports.__esModule = true;
exports.BlockchainEvent = void 0;
var Entity_js_1 = require("../Entity.js");
var BlockchainEventFactory_js_1 = require("./BlockchainEventFactory.js");
var Reference_js_1 = require("../Reference.js");
var Blockchain_js_1 = require("./Blockchain.js");
var BlockchainEvent = /** @class */ (function (_super) {
    __extends(BlockchainEvent, _super);
    function BlockchainEvent(factory, source, destination, contract, txid, timestamp, quantity, blockchain, sandra) {
        var _this = this;
        if (factory == null)
            factory = new BlockchainEventFactory_js_1.BlockchainEventFactory(blockchain, sandra);
        var txidRef = new Reference_js_1.Reference(sandra.get(Blockchain_js_1.Blockchain.TXID_CONCEPT_NAME), txid);
        _this = _super.call(this, factory, [txidRef]) || this;
        _this.addReference(new Reference_js_1.Reference(sandra.get(BlockchainEvent.EVENT_BLOCK_TIME), timestamp));
        _this.addReference(new Reference_js_1.Reference(sandra.get(BlockchainEvent.QUANTITY), quantity));
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
}(Entity_js_1.Entity));
exports.BlockchainEvent = BlockchainEvent;
var Box = /** @class */ (function () {
    function Box(obj) {
        this.x = obj && obj.x || 0;
        this.y = obj && obj.y || 0;
        this.height = obj && obj.height || 0;
        this.width = obj && obj.width || 0;
    }
    return Box;
}());
//# sourceMappingURL=BlockchainEvent.js.map