import { Entity } from "../classes/Rmrk/Entity.js";
import { Nft } from "../classes/Nft.js";
import { Collection } from "../classes/Collection.js";
import { Mint } from "../classes/Rmrk/Interactions/Mint.js";
import { ChangeIssuer } from "../classes/Rmrk/Interactions/ChangeIssuer.js";
import { MintNft } from "../classes/Rmrk/Interactions/MintNft.js";
import { Send } from "../classes/Rmrk/Interactions/Send.js";
import { List } from "../classes/Rmrk/Interactions/List.js";
import { Buy } from "../classes/Rmrk/Interactions/Buy.js";
import { Consume } from "../classes/Rmrk/Interactions/Consume.js";
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
        Entity.dataTreatment(splitted, this.entityObj);
        var myClass = (this.entityObj.id === null) ?
            new Nft(rmrk, this.chain, this.entityObj.version, this.signer) :
            new Collection(rmrk, this.chain, this.entityObj.version, this.signer);
        return myClass.rmrkToObject(this.entityObj);
    };
    RmrkReader.prototype.readInteraction = function (rmrk) {
        var splitted = rmrk.split('::');
        var interaction = splitted[1];
        interaction = interaction.toLowerCase();
        var interactObj;
        switch (interaction) {
            case 'mint':
                interactObj = new Mint(rmrk, this.chain, this.signer);
                break;
            case 'changeissuer':
                interactObj = new ChangeIssuer(rmrk, this.chain, this.signer);
                break;
            case 'mintnft':
                interactObj = new MintNft(rmrk, this.chain, this.signer);
                break;
            case 'send':
                interactObj = new Send(rmrk, this.chain, this.signer);
                break;
            case 'list':
                interactObj = new List(rmrk, this.chain, this.signer);
                break;
            case 'buy':
                interactObj = new Buy(rmrk, this.chain, this.signer);
                break;
            case 'consume':
            default:
                interactObj = new Consume(rmrk, this.chain, this.signer);
                break;
        }
        return interactObj;
    };
    return RmrkReader;
}());
export { RmrkReader };
