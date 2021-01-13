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
exports.Consume = void 0;
var Interaction_js_1 = require("../Interaction.js");
var Consume = /** @class */ (function (_super) {
    __extends(Consume, _super);
    function Consume(rmrk, chain, signer) {
        return _super.call(this, rmrk, Consume.name, chain, null, signer) || this;
    }
    Consume.prototype.createConsume = function () {
        var consume = this.rmrkToArray();
        var message;
        if (consume[1].toLowerCase() === "consume") {
            message = this.firstMessage(consume);
        }
        else {
            message = this.secondMessage(consume);
        }
        return message;
    };
    Consume.prototype.firstMessage = function (consume) {
        this.version = consume[2];
        this.nftToConsume = this.nftFromComputedId(consume[3]);
        return this;
    };
    Consume.prototype.secondMessage = function (consume) {
        this.reason = consume[1];
        this.nftToConsume = this.nftFromComputedId(consume[2]);
        var consumer = this.chain.getAddressClass();
        consumer.address = consume[3];
        this.consumer = consumer;
        return this;
    };
    Consume.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        json['nftToConsume'] = this.nftToConsume.toJson(false);
        json['reason'] = this.reason;
        json['consumer'] = this.consumer;
        return JSON.stringify(json);
    };
    return Consume;
}(Interaction_js_1.Interaction));
exports.Consume = Consume;
//# sourceMappingURL=Consume.js.map