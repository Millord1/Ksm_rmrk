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
const ts_dotenv_1 = require("ts-dotenv");
const assert_1 = require("assert");
const WestEnd_1 = require("../Blockchains/WestEnd");
const WestendBlockchain_1 = require("canonizer/src/canonizer/Substrate/Westend/WestendBlockchain");
const Kusama_1 = require("../Blockchains/Kusama");
const KusamaBlockchain_1 = require("canonizer/src/canonizer/Kusama/KusamaBlockchain");
class GossiperFactory {
    constructor(rmrk, csCanonizeManager, chain) {
        this.rmrk = rmrk;
        ;
        this.csCanonizeManager = csCanonizeManager;
        this.chain = chain;
        // this.csCanonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: GossiperFactory.getJwt(chain)} });
    }
    static getJwt(chain) {
        let jwt = "";
        if (chain === "westend") {
            const env = ts_dotenv_1.load({
                westend_jwt: String
            });
            assert_1.strict.ok(env.westend_jwt);
            jwt = env.westend_jwt;
        }
        else if (chain === "kusama") {
            const env = ts_dotenv_1.load({
                kusama_jwt: String
            });
            assert_1.strict.ok(env.kusama_jwt);
            jwt = env.kusama_jwt;
        }
        return jwt;
    }
    static getCanonizeChain(chainName, sandra) {
        switch (chainName.toLowerCase()) {
            case WestEnd_1.WestEnd.name.toLowerCase():
                return new WestendBlockchain_1.WestendBlockchain(sandra);
            case Kusama_1.Kusama.name.toLowerCase():
            default:
                return new KusamaBlockchain_1.KusamaBlockchain(sandra);
        }
    }
    async getGossiper() {
        const chain = this.rmrk.chain.constructor.name;
        const canonizeManager = this.csCanonizeManager;
        // Dispatch for gossiper if rmrk is correct
        if (this.rmrk instanceof Mint_1.Mint) {
            if (this.rmrk.collection) {
                return new EntityGossiper_1.EntityGossiper(this.rmrk.collection, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
            }
            return undefined;
        }
        else if (this.rmrk instanceof MintNft_1.MintNft) {
            if (this.rmrk.asset) {
                const entity = new EntityGossiper_1.EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
                await entity.gossip();
                return new EventGossiper_1.EventGossiper(this.rmrk, canonizeManager, this.chain);
            }
            return undefined;
        }
        else if (this.rmrk instanceof Send_1.Send) {
            if (this.rmrk.asset) {
                return new EventGossiper_1.EventGossiper(this.rmrk, canonizeManager, this.chain);
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