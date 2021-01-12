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
var ChangeIssuer = /** @class */ (function (_super) {
    __extends(ChangeIssuer, _super);
    function ChangeIssuer(rmrk, chain, signer) {
        return _super.call(this, rmrk, ChangeIssuer.name, chain, null, signer) || this;
    }
    ChangeIssuer.prototype.createChangeIssuer = function () {
        var splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.collectionId = splitted[3];
        var chainAddress = this.chain.getAddressClass();
        chainAddress.address = splitted[4];
        this.newIssuer = chainAddress;
        return this;
    };
    ChangeIssuer.prototype.toJson = function () {
        var json = this.toJsonSerialize();
        json['collectionId'] = this.collectionId;
        json['newIssuer'] = this.newIssuer;
        return JSON.stringify(json);
    };
    return ChangeIssuer;
}(Interaction));
export { ChangeIssuer };
