import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Nft} from "../classes/Nft";
import {Collection} from "../classes/Collection";
import {Send} from "../classes/Rmrk/Interactions/Send";
import {MintNft} from "../classes/Rmrk/Interactions/MintNft";
import {Mint} from "../classes/Rmrk/Interactions/Mint";
import {ChangeIssuer} from "../classes/Rmrk/Interactions/ChangeIssuer";
import {List} from "../classes/Rmrk/Interactions/List";
import {Buy} from "../classes/Rmrk/Interactions/Buy";
import {Consume} from "../classes/Rmrk/Interactions/Consume";
import {Entity} from "../classes/Rmrk/Entity";


export class RmrkReader
{

    private readonly signer: string;

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

    constructor(chain: Blockchain, signer: string){
        this.chain = chain;
        this.signer = signer;
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
            new Nft(rmrk, this.chain, this.entityObj.version, this.signer) :
            new Collection(rmrk, this.chain, this.entityObj.version, this.signer);


        return myClass.rmrkToObject(this.entityObj);
    }



    public readInteraction(rmrk: string){

        const splitted = rmrk.split('::');

        let interaction = splitted[1];
        interaction = interaction.toLowerCase();

        let interactObj;

        switch (interaction){

            case 'mint':

                const mint = new Mint(rmrk, this.chain, this.signer);
                interactObj = mint.createMint();

                break;

            case 'changeissuer':

                const changeIssuer = new ChangeIssuer(rmrk, this.chain, this.signer);
                interactObj = changeIssuer.createChangeIssuer();

                break;

            case 'mintnft':

                const mintNft = new MintNft(rmrk, this.chain, this.signer);
                interactObj = mintNft.createMintNft();

                break;

            case 'send' :

                const send = new Send(rmrk, this.chain, this.signer);
                interactObj = send.createSend();

                break;

            case 'list' :

                const list = new List(rmrk, this.chain, this.signer);
                interactObj = list.createList();

                break;

            case 'buy' :

                const buy = new Buy(rmrk, this.chain, this.signer);
                interactObj = buy.createBuy();

                break;

            case 'consume' :
            default :

                const consume = new Consume(rmrk, this.chain, this.signer);
                interactObj = consume.createConsume();

                break;
        }

        return interactObj;
    }



}