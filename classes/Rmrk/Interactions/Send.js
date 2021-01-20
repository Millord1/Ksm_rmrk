"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Send = void 0;
const Interaction_js_1 = require("../Interaction.js");
class Send extends Interaction_js_1.Interaction {
    // recipient: BlockchainAddress;
    constructor(rmrk, chain, transaction) {
        super(rmrk, Send.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        this.version = splitted[2];
        this.nftId = this.nftFromComputedId(splitted[3]);
        // @ts-ignore
        this.transaction.setDestination(this.chain.getAddressClass(splitted[4]));
        // // @ts-ignore
        // const blockchainAddress = this.chain.getAddressClass(this.transaction.source.address);
        // blockchainAddress.address = splitted[4];
        // this.recipient = blockchainAddress;
    }
    // public createSend(){
    //
    //     const splitted = this.rmrkToArray();
    //
    //     this.version = splitted[2];
    //
    //     this.nftId = this.nftFromComputedId(splitted[3]);
    //
    //     const blockchainAddress = this.chain.getAddressClass();
    //     blockchainAddress.address = splitted[4];
    //     this.recipient = blockchainAddress;
    //
    //     return this;
    // }
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftId'] = this.nftId.toJson(false, false);
        return JSON.stringify(json);
    }
}
exports.Send = Send;
//# sourceMappingURL=Send.js.map