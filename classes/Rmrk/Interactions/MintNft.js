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
import { Nft } from "../../Nft";
var MintNft = /** @class */ (function (_super) {
    __extends(MintNft, _super);
    function MintNft(rmrk, chain, signer) {
        return _super.call(this, rmrk, MintNft.name, chain, null, signer) || this;
    }
    MintNft.prototype.createMintNft = function () {
        // @ts-ignore
        var myNft = new Nft(this.rmrk, this.chain, null, this.signer.address);
        this.myNft = myNft.createNftFromInteraction();
        return this;
    };
    MintNft.prototype.toJson = function () {
        var json = this.myNft.toJson(false, true);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    };
    return MintNft;
}(Interaction));
export { MintNft };
