import {Blockchain} from "../classes/Blockchains/Blockchain.js";
import {Mint} from "../classes/Rmrk/Interactions/Mint.js";
import {ChangeIssuer} from "../classes/Rmrk/Interactions/ChangeIssuer.js";
import {MintNft} from "../classes/Rmrk/Interactions/MintNft.js";
import {Send} from "../classes/Rmrk/Interactions/Send.js";
import {List} from "../classes/Rmrk/Interactions/List.js";
import {Buy} from "../classes/Rmrk/Interactions/Buy.js";
import {Consume} from "../classes/Rmrk/Interactions/Consume.js";
import {Transaction} from "../classes/Transaction.js";
import {Metadata} from "../classes/Metadata.js";
import {Interaction} from "../classes/Rmrk/Interaction.js";


export class RmrkReader
{

    private readonly transaction: Transaction;

    chain: Blockchain;

    constructor(chain: Blockchain, transaction: Transaction){
        this.chain = chain;
        this.transaction = transaction;
    }


    public readInteraction(rmrk: string, meta: Metadata|null): Interaction|null{

        const splitted = rmrk.split('::');

        let interaction = splitted[1];
        interaction = interaction.toLowerCase();

        let interactObj;

        switch (interaction){

            case 'mint':
                interactObj = new Mint(rmrk, this.chain, this.transaction, meta);
                break;

            case 'changeissuer':
                interactObj = new ChangeIssuer(rmrk, this.chain, this.transaction);
                break;

            case 'mintnft':
                interactObj = new MintNft(rmrk, this.chain, this.transaction, meta);
                break;

            case 'send' :
                interactObj = new Send(rmrk, this.chain, this.transaction, meta);
                break;

            case 'list' :
                interactObj = new List(rmrk, this.chain, this.transaction, meta);
                break;

            case 'buy' :
                interactObj = new Buy(rmrk, this.chain, this.transaction, meta);
                break;

            case 'consume' :
                interactObj = new Consume(rmrk, this.chain, this.transaction, meta);
                break;

            default :
                interactObj = null;
                break;
        }

        return interactObj;
    }



}