import {Interaction} from "../Remark/Interactions/Interaction";
import {EntityGossiper} from "./EntityGossiper";
import {Mint} from "../Remark/Interactions/Mint";
import {Send} from "../Remark/Interactions/Send";
import {EventGossiper} from "./EventGossiper";
import {Buy} from "../Remark/Interactions/Buy";
import {MintNft} from "../Remark/Interactions/MintNft";
import {List} from "../Remark/Interactions/List";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {EnvSchema, load} from "ts-dotenv";
import {strict as assert} from "assert";
import {SandraManager} from "canonizer/src/SandraManager";
import {WestEnd} from "../Blockchains/WestEnd";
import {WestendBlockchain} from "canonizer/src/canonizer/Substrate/Westend/WestendBlockchain";
import {Kusama} from "../Blockchains/Kusama";
import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {Emote} from "../Remark/Interactions/Emote";


export class GossiperFactory
{

    private readonly rmrk: Interaction;

    private readonly csCanonizeManager: CSCanonizeManager;
    public static gossipUrl: string = "http://arkam.everdreamsoft.com/alex/gossip";
    private chain: Blockchain;

    constructor(rmrk: Interaction, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        this.rmrk = rmrk;
        this.csCanonizeManager = csCanonizeManager;
        this.chain = chain;
        // this.csCanonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: GossiperFactory.getJwt(chain)} });
    }


    public static getJwt(chain: string)
    {
        let jwt: string = "";
        let env: any;

        switch(chain){

            case "westend":
                env = load({
                    westend_jwt: String
                });
                assert.ok(env.westend_jwt);
                jwt = env.westend_jwt;
                break;

            case "kusama":
                env = load({
                    kusama_jwt: String,
                });
                assert.ok(env.kusama_jwt);
                jwt = env.kusama_jwt;
                break;

        }


        return jwt;
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
                    return new EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain, this.rmrk.unicode);
                }
                return undefined;


            case 'buy':
            case 'list':
                if (this.rmrk instanceof Buy || this.rmrk instanceof List && this.rmrk.asset) {

                }
                return undefined;

            default:
                return undefined;

        }


        //
        //     // Dispatch for gossiper if rmrk is correct
        //     if(this.rmrk instanceof Mint){
        //
        //         if(this.rmrk.collection){
        //             return new EntityGossiper(this.rmrk.collection, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
        //         }
        //         return undefined;
        //
        //     }else if(this.rmrk instanceof MintNft){
        //
        //         if(this.rmrk.asset){
        //             const entity = new EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
        //             await entity.gossip();
        //
        //             return new EventGossiper(this.rmrk, canonizeManager, this.chain);
        //         }
        //         return undefined;
        //
        //     }else if(this.rmrk instanceof Send){
        //
        //         if(this.rmrk.asset){
        //             return new EventGossiper(this.rmrk, canonizeManager, this.chain);
        //         }
        //         return undefined;
        //
        //     }else if(this.rmrk instanceof Buy || this.rmrk instanceof List){
        //
        //         if(this.rmrk.asset){
        //
        //         }
        //         return undefined;
        //
        //     }
        //
        //     return undefined;
        // }

    }

}