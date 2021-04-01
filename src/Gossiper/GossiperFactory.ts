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

    constructor(rmrk: Interaction) {
        this.rmrk = rmrk;
        const chain = rmrk.chain.constructor.name.toLowerCase();
        this.csCanonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: GossiperFactory.getJwt(chain)} });
    }


    private static getJwt(chain: string)
    {
        const jwtName = chain+"_jwt";

        const env = load({
            jwtName: String
        })

        assert.ok(env.jwtName != "jwt_code");
        assert.ok(env.jwtName != "");
        assert.ok(env.jwtName != null);
        assert.ok(env.jwtName != undefined);

        return env.jwtName;
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