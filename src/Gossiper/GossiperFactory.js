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
const WestEnd_1 = require("../Blockchains/WestEnd");
const WestendBlockchain_1 = require("canonizer/src/canonizer/Substrate/Westend/WestendBlockchain");
const Kusama_1 = require("../Blockchains/Kusama");
const KusamaBlockchain_1 = require("canonizer/src/canonizer/Kusama/KusamaBlockchain");
const Emote_1 = require("../Remark/Interactions/Emote");
const OrderGossiper_1 = require("./OrderGossiper");
const Consume_1 = require("../Remark/Interactions/Consume");
const ChangeIssuer_1 = require("../Remark/Interactions/ChangeIssuer");
const EmoteGossiper_1 = require("./EmoteGossiper");
const ChangeIssuerGossiper_1 = require("./ChangeIssuerGossiper");
const fs = require('fs');
class GossiperFactory {
    constructor(rmrk, csCanonizeManager, chain) {
        this.rmrk = rmrk;
        this.csCanonizeManager = csCanonizeManager;
        this.chain = chain;
    }
    static getJwt(chain, sandraEnv) {
        try {
            const content = JSON.parse(fs.readFileSync(".env"));
            return content[sandraEnv] ? content[sandraEnv] : "";
        }
        catch (e) {
            console.error(e);
            process.exit();
        }
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
                if (this.rmrk instanceof Emote_1.Emote && this.rmrk.asset) {
                    return new EmoteGossiper_1.EmoteGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;
            case 'consume':
                if (this.rmrk instanceof Consume_1.Consume && this.rmrk.asset) {
                    return new EventGossiper_1.EventGossiper(this.rmrk, this.csCanonizeManager, this.chain);
                }
                return undefined;
            case 'changeissuer':
                if (this.rmrk instanceof ChangeIssuer_1.ChangeIssuer && this.rmrk.collectionId) {
                    return new ChangeIssuerGossiper_1.ChangeIssuerGossiper(this.rmrk, this.csCanonizeManager, this.chain);
                }
                return undefined;
            case 'buy':
            case 'list':
                if (this.rmrk instanceof Buy_1.Buy || this.rmrk instanceof List_1.List && this.rmrk.asset) {
                    return new OrderGossiper_1.OrderGossiper(this.rmrk, canonizeManager, this.chain);
                }
                return undefined;
            default:
                return undefined;
        }
    }
}
exports.GossiperFactory = GossiperFactory;
GossiperFactory.gossipUrl = "http://arkam.everdreamsoft.com/alex/gossip";
//# sourceMappingURL=GossiperFactory.js.map