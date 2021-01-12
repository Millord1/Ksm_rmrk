"use strict";
exports.__esModule = true;
exports.RmrkReader = void 0;
var Nft_1 = require("../classes/Nft");
var Collection_1 = require("../classes/Collection");
var Send_1 = require("../classes/Rmrk/Interactions/Send");
var MintNft_1 = require("../classes/Rmrk/Interactions/MintNft");
var Mint_1 = require("../classes/Rmrk/Interactions/Mint");
var ChangeIssuer_1 = require("../classes/Rmrk/Interactions/ChangeIssuer");
var List_1 = require("../classes/Rmrk/Interactions/List");
var Buy_1 = require("../classes/Rmrk/Interactions/Buy");
var Consume_1 = require("../classes/Rmrk/Interactions/Consume");
var Entity_1 = require("../classes/Rmrk/Entity");
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
        Entity_1.Entity.dataTreatment(splitted, this.entityObj);
        var myClass = (this.entityObj.id === null) ?
            new Nft_1.Nft(rmrk, this.chain, this.entityObj.version, this.signer) :
            new Collection_1.Collection(rmrk, this.chain, this.entityObj.version, this.signer);
        return myClass.rmrkToObject(this.entityObj);
    };
    RmrkReader.prototype.readInteraction = function (rmrk) {
        var splitted = rmrk.split('::');
        var interaction = splitted[1];
        interaction = interaction.toLowerCase();
        var interactObj;
        switch (interaction) {
            case 'mint':
                var mint = new Mint_1.Mint(rmrk, this.chain, this.signer);
                interactObj = mint.createMint();
                break;
            case 'changeissuer':
                var changeIssuer = new ChangeIssuer_1.ChangeIssuer(rmrk, this.chain, this.signer);
                interactObj = changeIssuer.createChangeIssuer();
                break;
            case 'mintnft':
                var mintNft = new MintNft_1.MintNft(rmrk, this.chain, this.signer);
                interactObj = mintNft.createMintNft();
                break;
            case 'send':
                var send = new Send_1.Send(rmrk, this.chain, this.signer);
                interactObj = send.createSend();
                break;
            case 'list':
                var list = new List_1.List(rmrk, this.chain, this.signer);
                interactObj = list.createList();
                break;
            case 'buy':
                var buy = new Buy_1.Buy(rmrk, this.chain, this.signer);
                interactObj = buy.createBuy();
                break;
            case 'consume':
            default:
                var consume = new Consume_1.Consume(rmrk, this.chain, this.signer);
                interactObj = consume.createConsume();
                break;
        }
        return interactObj;
    };
    return RmrkReader;
}());
exports.RmrkReader = RmrkReader;
//# sourceMappingURL=RmrkReader.js.map