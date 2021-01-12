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
import { Interaction } from "../Interaction";
var Send = /** @class */ (function (_super) {
    __extends(Send, _super);
    function Send(rmrk, chain, signer) {
        return _super.call(this, rmrk, Send.name, chain, null, signer) || this;
    }
    Send.prototype.createSend = function () {
        var splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.nftId = this.nftFromComputedId(splitted[3]);
        var blockchainAddress = this.chain.getAddressClass();
        blockchainAddress.address = splitted[4];
        this.recipient = blockchainAddress;
        return this;
    };
    Send.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        json['nftId'] = this.nftId.toJson(false, false);
        json['recipient'] = this.recipient;
        return JSON.stringify(json);
    };
    return Send;
}(Interaction));
export { Send };
