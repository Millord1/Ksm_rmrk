"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmrkReader = void 0;
const Mint_1 = require("../Remark/Interactions/Mint");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const Send_1 = require("../Remark/Interactions/Send");
const Buy_1 = require("../Remark/Interactions/Buy");
const Emote_1 = require("../Remark/Interactions/Emote");
const List_1 = require("../Remark/Interactions/List");
const ChangeIssuer_1 = require("../Remark/Interactions/ChangeIssuer");
const Consume_1 = require("../Remark/Interactions/Consume");
class RmrkReader {
    constructor(chain, transaction) {
        this.chain = chain;
        this.transaction = transaction;
    }
    readInteraction(rmrk) {
        // Dispatch for object creation
        if (rmrk.includes('::')) {
            const rmrkArray = rmrk.split('::');
            if (rmrkArray.length >= 2) {
                let interaction = rmrkArray[1].toLowerCase();
                switch (interaction) {
                    case 'mint':
                        return new Mint_1.Mint(rmrk, this.chain, this.transaction);
                    case 'mintnft':
                        return new MintNft_1.MintNft(rmrk, this.chain, this.transaction);
                    case 'send':
                        return new Send_1.Send(rmrk, this.chain, this.transaction);
                    case 'buy':
                        return new Buy_1.Buy(rmrk, this.chain, this.transaction);
                    case 'emote':
                        return new Emote_1.Emote(rmrk, this.chain, this.transaction);
                    case 'list':
                        return new List_1.List(rmrk, this.chain, this.transaction);
                    case 'changeissuer':
                        return new ChangeIssuer_1.ChangeIssuer(rmrk, this.chain, this.transaction);
                    case 'consume':
                        return new Consume_1.Consume(rmrk, this.chain, this.transaction);
                    default:
                        return null;
                }
            }
        }
        return null;
    }
}
exports.RmrkReader = RmrkReader;
//# sourceMappingURL=RmrkReader.js.map