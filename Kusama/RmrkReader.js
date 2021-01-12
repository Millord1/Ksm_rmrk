import { Nft } from "../classes/Nft";
import { Collection } from "../classes/Collection";
import { Send } from "../classes/Rmrk/Interactions/Send";
import { MintNft } from "../classes/Rmrk/Interactions/MintNft";
import { Mint } from "../classes/Rmrk/Interactions/Mint";
import { ChangeIssuer } from "../classes/Rmrk/Interactions/ChangeIssuer";
import { List } from "../classes/Rmrk/Interactions/List";
import { Buy } from "../classes/Rmrk/Interactions/Buy";
import { Consume } from "../classes/Rmrk/Interactions/Consume";
import { Entity } from "../classes/Rmrk/Entity";
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
                var mint = new Mint(rmrk, this.chain, this.signer);
                interactObj = mint.createMint();
                break;
            case 'changeissuer':
                var changeIssuer = new ChangeIssuer(rmrk, this.chain, this.signer);
                interactObj = changeIssuer.createChangeIssuer();
                break;
            case 'mintnft':
                var mintNft = new MintNft(rmrk, this.chain, this.signer);
                interactObj = mintNft.createMintNft();
                break;
            case 'send':
                var send = new Send(rmrk, this.chain, this.signer);
                interactObj = send.createSend();
                break;
            case 'list':
                var list = new List(rmrk, this.chain, this.signer);
                interactObj = list.createList();
                break;
            case 'buy':
                var buy = new Buy(rmrk, this.chain, this.signer);
                interactObj = buy.createBuy();
                break;
            case 'consume':
            default:
                var consume = new Consume(rmrk, this.chain, this.signer);
                interactObj = consume.createConsume();
                break;
        }
        return interactObj;
    };
    return RmrkReader;
}());
export { RmrkReader };
