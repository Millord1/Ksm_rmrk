import {Blockchain} from "../classes/Blockchains/Blockchain.js";
import {Entity} from "../classes/Rmrk/Entity.js";
import {Asset} from "../classes/Asset.js";
import {Collection} from "../classes/Collection.js";
import {Mint} from "../classes/Rmrk/Interactions/Mint.js";
import {ChangeIssuer} from "../classes/Rmrk/Interactions/ChangeIssuer.js";
import {MintNft} from "../classes/Rmrk/Interactions/MintNft.js";
import {Send} from "../classes/Rmrk/Interactions/Send.js";
import {List} from "../classes/Rmrk/Interactions/List.js";
import {Buy} from "../classes/Rmrk/Interactions/Buy.js";
import {Consume} from "../classes/Rmrk/Interactions/Consume.js";
import {Transaction} from "../classes/Transaction.js";


export class RmrkReader
{

    private readonly transaction: Transaction;

    entityObj = {
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
    }

    chain: Blockchain;

    constructor(chain: Blockchain, transaction: Transaction){
        this.chain = chain;
        this.transaction = transaction;
    }


    public readRmrk(rmrk: string){

        const isInteraction = rmrk.includes('::');

        if(isInteraction){
            return this.readInteraction(rmrk);
        }else{
            return this.readEntity(rmrk);
        }

    }


    public readEntity(rmrk: string){

        const splitted = rmrk.split(',');

        Entity.dataTreatment(splitted, this.entityObj);

        const myClass = (this.entityObj.id === null) ?
            new Asset(rmrk, this.chain, this.entityObj.version, this.transaction) :
            new Collection(rmrk, this.chain, this.entityObj.version, this.transaction);

        return myClass.rmrkToObject(this.entityObj);
    }



    public readInteraction(rmrk: string){

        const splitted = rmrk.split('::');

        let interaction = splitted[1];
        interaction = interaction.toLowerCase();

        let interactObj;

        switch (interaction){

            case 'mint':

                interactObj = new Mint(rmrk, this.chain, this.transaction);

                break;

            case 'changeissuer':

                interactObj = new ChangeIssuer(rmrk, this.chain, this.transaction);

                break;

            case 'mintnft':

                interactObj = new MintNft(rmrk, this.chain, this.transaction);

                break;

            case 'send' :

                interactObj = new Send(rmrk, this.chain, this.transaction);

                break;

            case 'list' :

                interactObj = new List(rmrk, this.chain, this.transaction);

                break;

            case 'buy' :

                interactObj = new Buy(rmrk, this.chain, this.transaction);

                break;

            case 'consume' :
            default :

                interactObj = new Consume(rmrk, this.chain, this.transaction);

                break;
        }

        return interactObj;
    }



}