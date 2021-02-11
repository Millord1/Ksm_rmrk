"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmrkReader = void 0;
const Mint_js_1 = require("../classes/Rmrk/Interactions/Mint.js");
const ChangeIssuer_js_1 = require("../classes/Rmrk/Interactions/ChangeIssuer.js");
const MintNft_js_1 = require("../classes/Rmrk/Interactions/MintNft.js");
const Send_js_1 = require("../classes/Rmrk/Interactions/Send.js");
const List_js_1 = require("../classes/Rmrk/Interactions/List.js");
const Buy_js_1 = require("../classes/Rmrk/Interactions/Buy.js");
const Consume_js_1 = require("../classes/Rmrk/Interactions/Consume.js");
const Emote_js_1 = require("../classes/Rmrk/Interactions/Emote.js");
class RmrkReader {
    constructor(chain, transaction) {
        this.chain = chain;
        this.transaction = transaction;
    }
    readInteraction(rmrk, meta) {
        if (rmrk.includes('::')) {
            const splitted = rmrk.split('::');
            if (splitted.length >= 2) {
                let interaction = splitted[1];
                interaction = interaction.toLowerCase();
                let interactObj;
                switch (interaction) {
                    case 'mint':
                        interactObj = new Mint_js_1.Mint(rmrk, this.chain, this.transaction, meta);
                        break;
                    case 'changeissuer':
                        interactObj = new ChangeIssuer_js_1.ChangeIssuer(rmrk, this.chain, this.transaction);
                        break;
                    case 'mintnft':
                        interactObj = new MintNft_js_1.MintNft(rmrk, this.chain, this.transaction, meta);
                        break;
                    case 'send':
                        interactObj = new Send_js_1.Send(rmrk, this.chain, this.transaction, meta);
                        break;
                    case 'list':
                        interactObj = new List_js_1.List(rmrk, this.chain, this.transaction, meta);
                        break;
                    case 'buy':
                        interactObj = new Buy_js_1.Buy(rmrk, this.chain, this.transaction, meta);
                        break;
                    case 'consume':
                        interactObj = new Consume_js_1.Consume(rmrk, this.chain, this.transaction, meta);
                        break;
                    case 'emote':
                        interactObj = new Emote_js_1.Emote(rmrk, this.chain, this.transaction, meta);
                        break;
                    default:
                        interactObj = null;
                        break;
                }
                return interactObj;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}
exports.RmrkReader = RmrkReader;
//# sourceMappingURL=RmrkReader.js.map