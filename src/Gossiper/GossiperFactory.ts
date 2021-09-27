import {Interaction} from "../Remark/Interactions/Interaction";
import {EntityGossiper} from "./EntityGossiper";
import {Mint} from "../Remark/Interactions/Mint";
import {Send} from "../Remark/Interactions/Send";
import {EventGossiper} from "./EventGossiper";
import {Buy} from "../Remark/Interactions/Buy";
import {MintNft} from "../Remark/Interactions/MintNft";
import {List} from "../Remark/Interactions/List";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {SandraManager} from "canonizer/src/SandraManager";
import {WestEnd} from "../Blockchains/WestEnd";
import {WestendBlockchain} from "canonizer/src/canonizer/Substrate/Westend/WestendBlockchain";
import {Kusama} from "../Blockchains/Kusama";
import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {Emote} from "../Remark/Interactions/Emote";
import {OrderGossiper} from "./OrderGossiper";
import {Consume} from "../Remark/Interactions/Consume";
import {ChangeIssuer} from "../Remark/Interactions/ChangeIssuer";
import {EmoteGossiper} from "./EmoteGossiper";
import {ChangeIssuerGossiper} from "./ChangeIssuerGossiper";

const fs = require('fs')


export class GossiperFactory
{

    private readonly rmrk: Interaction;

    private readonly csCanonizeManager: CSCanonizeManager;
    public static gossipUrl: string = "https://helvetia.everdreamsoft.com/alex/gossip";
    // public static gossipUrl: string = "http://localhost:8000/alex/gossip";
    private readonly chain: Blockchain;

    constructor(rmrk: Interaction, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        this.rmrk = rmrk;
        this.csCanonizeManager = csCanonizeManager;
        this.chain = chain;
    }


    public static getJwt(chain: string, sandraEnv: string)
    {
        try{
            const content = JSON.parse(fs.readFileSync(".env"));
            return content[sandraEnv] ? content[sandraEnv] : "";
        }catch(e){
            console.error(e);
            process.exit();
        }
    }


    public static getCanonizeChain(chainName: string, sandra: SandraManager)
    {

        switch(chainName.toLowerCase()){

            case WestEnd.name.toLowerCase():
                return new WestendBlockchain(sandra);

            case Kusama.name.toLowerCase():
            default:
                return new KusamaBlockchain(sandra);

        }

    }



    public async getGossiper() {

        const canonizeManager = this.csCanonizeManager;


        switch (this.rmrk.constructor.name.toLowerCase()) {

            case 'mint':
                if (this.rmrk instanceof Mint && this.rmrk.collection) {
                    return new EntityGossiper(this.rmrk.collection, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
                }
                return undefined;


            case 'mintnft':
                if (this.rmrk instanceof MintNft && this.rmrk.asset) {
                    const entity = new EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
                    await entity.gossip();

                    return new EventGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;


            case 'send':
                if (this.rmrk instanceof Send && this.rmrk.asset) {
                    return new EventGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;


            case 'emote':
                if (this.rmrk instanceof Emote && this.rmrk.asset) {
                    return new EmoteGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;

            case 'consume':
                if(this.rmrk instanceof Consume && this.rmrk.asset){
                    return new EventGossiper(this.rmrk, this.csCanonizeManager, this.chain);
                }
                return undefined;

            case 'changeissuer':
                if(this.rmrk instanceof ChangeIssuer && this.rmrk.collectionId){
                    return new ChangeIssuerGossiper(this.rmrk, this.csCanonizeManager, this.chain);
                }
                return undefined;

            case 'buy':
            case 'list':
                if (this.rmrk instanceof Buy || this.rmrk instanceof List && this.rmrk.asset) {
                    return new OrderGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;

            default:
                return undefined;

        }

    }

}