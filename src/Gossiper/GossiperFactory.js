"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossiperFactory = void 0;
const EntityGossiper_1 = require("./EntityGossiper");
const Mint_1 = require("../Remark/Interactions/Mint");
const Send_1 = require("../Remark/Interactions/Send");
const EventGossiper_1 = require("./EventGossiper");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const ts_dotenv_1 = require("ts-dotenv");
const assert_1 = require("assert");
const WestEnd_1 = require("../Blockchains/WestEnd");
const WestendBlockchain_1 = require("canonizer/src/canonizer/Substrate/Westend/WestendBlockchain");
const Kusama_1 = require("../Blockchains/Kusama");
const KusamaBlockchain_1 = require("canonizer/src/canonizer/Kusama/KusamaBlockchain");
class GossiperFactory {
    constructor(rmrk, csCanonizeManager, chain) {
        this.rmrk = rmrk;
        this.csCanonizeManager = csCanonizeManager;
        this.chain = chain;
        // this.csCanonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: GossiperFactory.getJwt(chain)} });
    }
    static getJwt(chain) {
        let jwt = "";
        let env;
        switch (chain.toLowerCase()) {
            case "westend":
                env = ts_dotenv_1.load({
                    westend_jwt: String
                });
                assert_1.strict.ok(env.westend_jwt);
                jwt = env.westend_jwt;
                break;
            case "kusama":
                env = ts_dotenv_1.load({
                    kusama_jwt: String,
                });
                assert_1.strict.ok(env.kusama_jwt);
                jwt = env.kusama_jwt;
                break;
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
        const canonizeManager = this.csCanonizeManager;
        switch (this.rmrk.constructor.name.toLowerCase()) {
            case 'mint':
                if (this.rmrk instanceof Mint_1.Mint && this.rmrk.collection) {
                    return new EntityGossiper_1.EntityGossiper(this.rmrk.collection, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
                }
                return undefined;
            case 'mintnft':
                if (this.rmrk instanceof MintNft_1.MintNft && this.rmrk.asset) {
                    const entity = new EntityGossiper_1.EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain);
                    await entity.gossip();
                    return new EventGossiper_1.EventGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;
            case 'send':
                if (this.rmrk instanceof Send_1.Send && this.rmrk.asset) {
                    return new EventGossiper_1.EventGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;
            case 'emote':
            // if (this.rmrk instanceof Emote && this.rmrk.asset) {
            //     return new EntityGossiper(this.rmrk.asset, this.rmrk.transaction.blockId, this.rmrk.transaction.source, canonizeManager, this.chain, this.rmrk.unicode);
            // }
            // return undefined;
            case 'buy':
            case 'list':
            // if (this.rmrk instanceof Buy || this.rmrk instanceof List && this.rmrk.asset) {
            //     return new OrderGossiper(this.rmrk, canonizeManager, this.chain);
            // }
            // return undefined;
            default:
                return undefined;
        }
    }
}
exports.GossiperFactory = GossiperFactory;
GossiperFactory.gossipUrl = "http://arkam.everdreamsoft.com/alex/gossip";
//# sourceMappingURL=GossiperFactory.js.map