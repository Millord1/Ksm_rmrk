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
class RmrkReader {
    constructor(chain, transaction) {
        this.chain = chain;
        this.transaction = transaction;
    }
    // public readRmrk(rmrk: string){
    //
    //     const isInteraction = rmrk.includes('::');
    //
    //     if(isInteraction){
    //         return this.readInteraction(rmrk);
    //     }else{
    //         return this.readEntity(rmrk);
    //     }
    //
    // }
    //
    //
    // public readEntity(rmrk: string){
    //
    //     const splitted = rmrk.split(',');
    //
    //     const obj : EntityInterface = Entity.dataTreatment(splitted, Remark.entityObj);
    //
    //     return (obj.id === "") ?
    //         new Asset(rmrk, this.chain, obj.version, this.transaction, obj) :
    //         new Collection(rmrk, this.chain, obj.version, this.transaction, obj);
    //
    // }
    readInteraction(rmrk, meta) {
        const splitted = rmrk.split('::');
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
            default:
                interactObj = new Consume_js_1.Consume(rmrk, this.chain, this.transaction, meta);
                break;
        }
        return interactObj;
    }
}
exports.RmrkReader = RmrkReader;
//# sourceMappingURL=RmrkReader.js.map