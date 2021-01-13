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
import { Interaction } from "../Interaction.js";
var Consume = /** @class */ (function (_super) {
    __extends(Consume, _super);
    function Consume(rmrk, chain, signer) {
        var _this = _super.call(this, rmrk, Consume.name, chain, null, signer) || this;
        var consume = _this.rmrkToArray();
        if (consume[1].toLowerCase() === "consume") {
            _this.version = consume[2];
            _this.nftToConsume = _this.nftFromComputedId(consume[3]);
        }
        else {
            _this.reason = consume[1];
            _this.nftToConsume = _this.nftFromComputedId(consume[2]);
            var consumer = _this.chain.getAddressClass();
            consumer.address = consume[3];
            _this.consumer = consumer;
        }
        return _this;
    }
    // public createConsume(){
    //
    //     const consume = this.rmrkToArray();
    //     let message;
    //
    //     if(consume[1].toLowerCase() === "consume"){
    //         message = this.firstMessage(consume);
    //     }else{
    //         message = this.secondMessage(consume);
    //     }
    //
    //     return message;
    // }
    // private firstMessage(consume){
    //
    //     this.version = consume[2];
    //     this.nftToConsume = this.nftFromComputedId(consume[3]);
    //
    //     return this;
    // }
    //
    //
    // private secondMessage(consume){
    //
    //     this.reason = consume[1];
    //     this.nftToConsume = this.nftFromComputedId(consume[2])
    //
    //     const consumer = this.chain.getAddressClass();
    //     consumer.address = consume[3];
    //     this.consumer = consumer;
    //
    //     return this;
    // }
    Consume.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        // @ts-ignore
        json['nftToConsume'] = this.nftToConsume.toJson(false);
        // @ts-ignore
        json['reason'] = this.reason;
        // @ts-ignore
        json['consumer'] = this.consumer;
        return JSON.stringify(json);
    };
    return Consume;
}(Interaction));
export { Consume };
