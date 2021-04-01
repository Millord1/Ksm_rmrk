"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossiperFactory = void 0;
const EntityGossiper_1 = require("./EntityGossiper");
const Mint_1 = require("../Remark/Interactions/Mint");
const Send_1 = require("../Remark/Interactions/Send");
const EventGossiper_1 = require("./EventGossiper");
const Buy_1 = require("../Remark/Interactions/Buy");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const List_1 = require("../Remark/Interactions/List");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
class GossiperFactory {
    constructor(rmrk) {
        this.rmrk = rmrk;
        const chain = rmrk.chain.constructor.name.toLowerCase();
        this.csCanonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory.gossipUrl, jwt: GossiperFactory.getJwt(chain) } });
    }
    static getJwt(chain) {
        if (chain === "kusama") {
            return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJrc21qZXRza2kiLCJmbHVzaCI6ZmFsc2UsImV4cCI6MTA0NDY5NTk0NTQ0ODAwMH0.STcvv0wGBU7SOQKMNhK9I-9YducCl5Wz1a3N7q_cydM";
        }
        else if (chain === "westend") {
            return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJzaGlidXlhIiwiZmx1c2giOmZhbHNlLCJleHAiOjEwNDc0NDY1NzcxNDQwMDB9.VNMArL_m04pSxuOqaNbwGc38z-bfQnHntGJHa2FgAXQ";
        }
        else {
            return "";
        }
        //
        // const env = load({
        //
        // })
        // assert.ok(env.jwtName != "jwt_code");
        // assert.ok(env.jwtName != "");
        // assert.ok(env.jwtName != null);
        // assert.ok(env.jwtName != undefined);
        // return env.jwtName;
    }
    async getGossiper() {
        const chain = this.rmrk.chain.constructor.name;
        const canonizeManager = this.csCanonizeManager;
        // Dispatch for gossiper if rmrk is correct
        if (this.rmrk instanceof Mint_1.Mint) {
            if (this.rmrk.collection) {
                return new EntityGossiper_1.EntityGossiper(this.rmrk.collection, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, chain);
            }
            return undefined;
        }
        else if (this.rmrk instanceof MintNft_1.MintNft) {
            if (this.rmrk.asset) {
                const entity = new EntityGossiper_1.EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, chain);
                await entity.gossip();
                return new EventGossiper_1.EventGossiper(this.rmrk, canonizeManager, chain);
            }
            return undefined;
        }
        else if (this.rmrk instanceof Send_1.Send) {
            if (this.rmrk.asset) {
                return new EventGossiper_1.EventGossiper(this.rmrk, canonizeManager, chain);
            }
            return undefined;
        }
        else if (this.rmrk instanceof Buy_1.Buy || this.rmrk instanceof List_1.List) {
            if (this.rmrk.asset) {
            }
            return undefined;
        }
        return undefined;
    }
}
exports.GossiperFactory = GossiperFactory;
GossiperFactory.gossipUrl = "http://arkam.everdreamsoft.com/alex/gossip";
//# sourceMappingURL=GossiperFactory.js.map