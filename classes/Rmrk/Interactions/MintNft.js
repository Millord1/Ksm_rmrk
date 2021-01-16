"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Nft_js_1 = require("../../Nft.js");
class MintNft extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, signer) {
        super(rmrk, MintNft.name, chain, null, signer);
        // @ts-ignore
        const myNft = new Nft_js_1.Nft(this.rmrk, this.chain, null, this.signer.address);
        this.myNft = myNft.createNftFromInteraction();
    }
    // public createMintNft(){
    //
    //     // @ts-ignore
    //     const myNft = new Nft(this.rmrk, this.chain, null, this.signer.address);
    //     this.myNft = myNft.createNftFromInteraction();
    //
    //     return this;
    // }
    toJson() {
        const json = this.myNft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map