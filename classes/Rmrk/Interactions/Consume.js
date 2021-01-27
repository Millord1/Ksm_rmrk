"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consume = void 0;
const Interaction_js_1 = require("../Interaction.js");
class Consume extends Interaction_js_1.Interaction {
    // consumer: BlockchainAddress | undefined;
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, Consume.name, chain, null, transaction);
        const consume = this.rmrkToArray();
        if (consume[1].toLowerCase() === "consume") {
            this.version = consume[2];
            this.nft = this.nftFromComputedId(consume[3], meta);
        }
        else {
            this.reason = consume[1];
            this.nft = this.nftFromComputedId(consume[2], meta);
            // const consumer = this.chain.getAddressClass(transaction.source);
            // consumer.address = consume[3];
            // this.consumer = consumer;
        }
    }
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
    toJson() {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['nftToConsume'] = this.nftToConsume.toJson(false);
        // @ts-ignore
        json['reason'] = this.reason;
        // @ts-ignore
        json['consumer'] = this.consumer;
        return JSON.stringify(json);
    }
}
exports.Consume = Consume;
//# sourceMappingURL=Consume.js.map