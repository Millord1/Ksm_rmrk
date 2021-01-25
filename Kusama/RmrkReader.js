"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmrkReader = void 0;
const Entity_js_1 = require("../classes/Rmrk/Entity.js");
const Asset_js_1 = require("../classes/Asset.js");
const Collection_js_1 = require("../classes/Collection.js");
const Mint_js_1 = require("../classes/Rmrk/Interactions/Mint.js");
const ChangeIssuer_js_1 = require("../classes/Rmrk/Interactions/ChangeIssuer.js");
const MintNft_js_1 = require("../classes/Rmrk/Interactions/MintNft.js");
const Send_js_1 = require("../classes/Rmrk/Interactions/Send.js");
const List_js_1 = require("../classes/Rmrk/Interactions/List.js");
const Buy_js_1 = require("../classes/Rmrk/Interactions/Buy.js");
const Consume_js_1 = require("../classes/Rmrk/Interactions/Consume.js");
const Remark_js_1 = require("../classes/Rmrk/Remark.js");
class RmrkReader {
    constructor(chain, transaction) {
        this.chain = chain;
        this.transaction = transaction;
    }
    readRmrk(rmrk) {
        const isInteraction = rmrk.includes('::');
        if (isInteraction) {
            return this.readInteraction(rmrk);
        }
        else {
            return this.readEntity(rmrk);
        }
    }
    readEntity(rmrk) {
        const splitted = rmrk.split(',');
        const obj = Entity_js_1.Entity.dataTreatment(splitted, Remark_js_1.Remark.entityObj);
        return (obj.id === "") ?
            new Asset_js_1.Asset(rmrk, this.chain, obj.version, this.transaction, obj, obj.metadata) :
            new Collection_js_1.Collection(rmrk, this.chain, obj.version, this.transaction, obj, obj.metadata);
    }
    readInteraction(rmrk) {
        const splitted = rmrk.split('::');
        let interaction = splitted[1];
        interaction = interaction.toLowerCase();
        let interactObj;
        switch (interaction) {
            case 'mint':
                interactObj = new Mint_js_1.Mint(rmrk, this.chain, this.transaction);
                break;
            case 'changeissuer':
                interactObj = new ChangeIssuer_js_1.ChangeIssuer(rmrk, this.chain, this.transaction);
                break;
            case 'mintnft':
                interactObj = new MintNft_js_1.MintNft(rmrk, this.chain, this.transaction);
                break;
            case 'send':
                interactObj = new Send_js_1.Send(rmrk, this.chain, this.transaction);
                break;
            case 'list':
                interactObj = new List_js_1.List(rmrk, this.chain, this.transaction);
                break;
            case 'buy':
                interactObj = new Buy_js_1.Buy(rmrk, this.chain, this.transaction);
                break;
            case 'consume':
            default:
                interactObj = new Consume_js_1.Consume(rmrk, this.chain, this.transaction);
                break;
        }
        return interactObj;
    }
}
exports.RmrkReader = RmrkReader;
//# sourceMappingURL=RmrkReader.js.map