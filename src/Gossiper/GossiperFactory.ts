import {Interaction} from "../Remark/Interactions/Interaction";
import {EntityGossiper} from "./EntityGossiper";
import {Mint} from "../Remark/Interactions/Mint";
import {Send} from "../Remark/Interactions/Send";
import {EventGossiper} from "./EventGossiper";
import {Buy} from "../Remark/Interactions/Buy";
import {MintNft} from "../Remark/Interactions/MintNft";
import {List} from "../Remark/Interactions/List";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {load} from "ts-dotenv";
import {strict as assert} from "assert";


export class GossiperFactory
{

    private readonly rmrk: Interaction;

    private readonly csCanonizeManager: CSCanonizeManager;
    public static gossipUrl: string = "http://arkam.everdreamsoft.com/alex/gossip";

    constructor(rmrk: Interaction, csCanonizeManager: CSCanonizeManager) {
        this.rmrk = rmrk;
        const chain = rmrk.chain.constructor.name.toLowerCase();
        this.csCanonizeManager = csCanonizeManager;
        // this.csCanonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: GossiperFactory.getJwt(chain)} });
    }


    public static getJwt(chain: string)
    {
        let jwt: string = "";

        if(chain === "westend"){

            const env = load({
                westend_jwt: String
            });
            assert.ok(env.westend_jwt);
            jwt = env.westend_jwt;

        }else if(chain === "kusama"){

            const env = load({
                kusama_jwt: String
            });
            assert.ok(env.kusama_jwt);
            jwt = env.kusama_jwt;
        }

        return jwt;
    }



    public async getGossiper()
    {

        const chain = this.rmrk.chain.constructor.name;
        const canonizeManager = this.csCanonizeManager;

        // Dispatch for gossiper if rmrk is correct
        if(this.rmrk instanceof Mint){

            if(this.rmrk.collection){
                return new EntityGossiper(this.rmrk.collection, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, chain);
            }
            return undefined;

        }else if(this.rmrk instanceof MintNft){

            if(this.rmrk.asset){
                const entity = new EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, chain);
                await entity.gossip();

                return new EventGossiper(this.rmrk, canonizeManager, chain);
            }
            return undefined;

        }else if(this.rmrk instanceof Send){

            if(this.rmrk.asset){
                return new EventGossiper(this.rmrk, canonizeManager, chain);
            }
            return undefined;

        }else if(this.rmrk instanceof Buy || this.rmrk instanceof List){

            if(this.rmrk.asset){

            }
            return undefined;

        }

        return undefined;
    }




}