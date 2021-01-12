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
import { Collection } from "../../Collection";
var Mint = /** @class */ (function (_super) {
    __extends(Mint, _super);
    function Mint(rmrk, chain, signer) {
        return _super.call(this, rmrk, Mint.name, chain, null, signer) || this;
    }
    Mint.prototype.createMint = function () {
        //@ts-ignore
        var myCollection = new Collection(this.rmrk, this.chain, null, this.signer.address);
        this.myCollection = myCollection.createCollectionFromInteraction();
        return this;
    };
    Mint.prototype.toJson = function () {
        var json = this.myCollection.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    };
    return Mint;
}(Interaction));
export { Mint };
