"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeIssuer = void 0;
const Interaction_js_1 = require("../Interaction.js");
class ChangeIssuer extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, signer) {
        super(rmrk, ChangeIssuer.name, chain, null, signer);
        const splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.collectionId = splitted[3];
        const chainAddress = this.chain.getAddressClass();
        chainAddress.address = splitted[4];
        this.newIssuer = chainAddress;
    }
    // public createChangeIssuer(){
    //     const splitted = this.rmrkToArray();
    //
    //     this.version = splitted[2];
    //     this.collectionId = splitted[3];
    //
    //     const chainAddress = this.chain.getAddressClass();
    //     chainAddress.address = splitted[4];
    //     this.newIssuer = chainAddress;
    //
    //     return this;
    // }
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['collectionId'] = this.collectionId;
        // @ts-ignore
        json['newIssuer'] = this.newIssuer;
        return JSON.stringify(json);
    }
}
exports.ChangeIssuer = ChangeIssuer;
//# sourceMappingURL=ChangeIssuer.js.map