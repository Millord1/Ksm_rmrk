"use strict";
exports.__esModule = true;
exports.RmrkReader = void 0;
var Entity_js_1 = require("../classes/Rmrk/Entity.js");
var Nft_js_1 = require("../classes/Nft.js");
var Collection_js_1 = require("../classes/Collection.js");
var Mint_js_1 = require("../classes/Rmrk/Interactions/Mint.js");
var ChangeIssuer_js_1 = require("../classes/Rmrk/Interactions/ChangeIssuer.js");
var MintNft_js_1 = require("../classes/Rmrk/Interactions/MintNft.js");
var Send_js_1 = require("../classes/Rmrk/Interactions/Send.js");
var List_js_1 = require("../classes/Rmrk/Interactions/List.js");
var Buy_js_1 = require("../classes/Rmrk/Interactions/Buy.js");
var Consume_js_1 = require("../classes/Rmrk/Interactions/Consume.js");
var RmrkReader = /** @class */ (function () {
    function RmrkReader(chain, signer) {
        this.entityObj = {
            version: null,
            name: null,
            max: null,
            symbol: null,
            id: null,
            metadata: null,
            issuer: null,
            transferable: null,
            sn: null,
            collection: null
        };
        this.chain = chain;
        this.signer = signer;
    }
    RmrkReader.prototype.readRmrk = function (rmrk) {
        var isInteraction = rmrk.includes('::');
        if (isInteraction) {
            return this.readInteraction(rmrk);
        }
        else {
            return this.readEntity(rmrk);
        }
    };
    RmrkReader.prototype.readEntity = function (rmrk) {
        var splitted = rmrk.split(',');
        Entity_js_1.Entity.dataTreatment(splitted, this.entityObj);
        var myClass = (this.entityObj.id === null) ?
            new Nft_js_1.Nft(rmrk, this.chain, this.entityObj.version, this.signer) :
            new Collection_js_1.Collection(rmrk, this.chain, this.entityObj.version, this.signer);
        return myClass.rmrkToObject(this.entityObj);
    };
    RmrkReader.prototype.readInteraction = function (rmrk) {
        var splitted = rmrk.split('::');
        var interaction = splitted[1];
        interaction = interaction.toLowerCase();
        var interactObj;
        switch (interaction) {
            case 'mint':
                var mint = new Mint_js_1.Mint(rmrk, this.chain, this.signer);
                interactObj = mint.createMint();
                break;
            case 'changeissuer':
                var changeIssuer = new ChangeIssuer_js_1.ChangeIssuer(rmrk, this.chain, this.signer);
                interactObj = changeIssuer.createChangeIssuer();
                break;
            case 'mintnft':
                var mintNft = new MintNft_js_1.MintNft(rmrk, this.chain, this.signer);
                interactObj = mintNft.createMintNft();
                break;
            case 'send':
                var send = new Send_js_1.Send(rmrk, this.chain, this.signer);
                interactObj = send.createSend();
                break;
            case 'list':
                var list = new List_js_1.List(rmrk, this.chain, this.signer);
                interactObj = list.createList();
                break;
            case 'buy':
                var buy = new Buy_js_1.Buy(rmrk, this.chain, this.signer);
                interactObj = buy.createBuy();
                break;
            case 'consume':
            default:
                var consume = new Consume_js_1.Consume(rmrk, this.chain, this.signer);
                interactObj = consume.createConsume();
                break;
        }
        return interactObj;
    };
    return RmrkReader;
}());
exports.RmrkReader = RmrkReader;
//# sourceMappingURL=RmrkReader.js.map