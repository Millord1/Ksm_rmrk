"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../src/Remark/Transaction");
const RmrkReader_1 = require("../src/Jetski/RmrkReader");
const Interactions_test_1 = require("./Interactions.test");
const GossiperFactory_1 = require("../src/Gossiper/GossiperFactory");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const Mint_1 = require("../src/Remark/Interactions/Mint");
const EntityGossiper_1 = require("../src/Gossiper/EntityGossiper");
const MintNft_1 = require("../src/Remark/Interactions/MintNft");
const EventGossiper_1 = require("../src/Gossiper/EventGossiper");
const List_1 = require("../src/Remark/Interactions/List");
const OrderGossiper_1 = require("../src/Gossiper/OrderGossiper");
const BlockchainOrderFactory_1 = require("canonizer/src/canonizer/BlockchainOrderFactory");
const AssetCollectionFactory_1 = require("canonizer/src/canonizer/AssetCollectionFactory");
const AssetFactory_1 = require("canonizer/src/canonizer/AssetFactory");
const Emote_1 = require("../src/Remark/Interactions/Emote");
const EmoteGossiper_1 = require("../src/Gossiper/EmoteGossiper");
const BlockchainEmoteFactory_1 = require("canonizer/src/canonizer/BlockchainEmoteFactory");
const ChangeIssuerFactory_1 = require("canonizer/src/canonizer/ChangeIssuerFactory");
const ChangeIssuer_1 = require("../src/Remark/Interactions/ChangeIssuer");
const ChangeIssuerGossiper_1 = require("../src/Gossiper/ChangeIssuerGossiper");
const jwt = GossiperFactory_1.GossiperFactory.getJwt(Interactions_test_1.blockchain.constructor.name, "gossip");
const canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: jwt } });
const canonizeChain = GossiperFactory_1.GossiperFactory.getCanonizeChain(Interactions_test_1.blockchain.constructor.name, canonizeManager.getSandra());
describe('gossiper test', () => {
    test('gossip collection', () => {
        var _a;
        let mintRmrk = "RMRK::MINT::1.0.0::%7B%22name%22%3A%22%5C%22Kulupu%20NOT%20dead%5C%22%22%2C%22max%22%3A0%2C%22issuer%22%3A%22DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu%22%2C%22symbol%22%3A%22KULUPUNOTDEAD%22%2C%22id%22%3A%22240f37351b4ec74a1b-KULUPUNOTDEAD%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i%22%7D";
        mintRmrk = decodeURIComponent(mintRmrk);
        const tx = new Transaction_1.Transaction(Interactions_test_1.block, Interactions_test_1.txHash, Interactions_test_1.timestamp, Interactions_test_1.blockchain, Interactions_test_1.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(Interactions_test_1.blockchain, tx);
        const mint = rmrkReader.readInteraction(mintRmrk);
        if (mint instanceof Mint_1.Mint) {
            (_a = mint.collection) === null || _a === void 0 ? void 0 : _a.addMetadata(Interactions_test_1.metaData);
        }
        //@ts-ignore
        expect(mint.collection.contract.collection).toBe("\"Kulupu NOT dead\"");
        expect(mint).toBeInstanceOf(Mint_1.Mint);
        // @ts-ignore
        const gossip = new GossiperFactory_1.GossiperFactory(mint, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();
        expect(gossiper).toBeInstanceOf(EntityGossiper_1.EntityGossiper);
        gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
        const collectionEntities = canonizeManager.getAssetCollectionFactory().entityArray;
        expect(collectionEntities.length).toBeGreaterThan(0);
        //@ts-ignore
        expect(collectionEntities[0].getRefValue(AssetCollectionFactory_1.AssetCollectionFactory.MAIN_NAME)).toBe("\"Kulupu NOT dead\"");
    });
    test("gossip asset", () => {
        let mintNftRmrk = "RMRK::MINTNFT::1.0.0::%7B%22collection%22%3A%2254adb573ab0a2f5b32-CURSEDAI%22%2C%22name%22%3A%22Cursed%20AI%20%7C%20%2359%22%2C%22instance%22%3A%22CURSED_AI_OR_59%22%2C%22transferable%22%3A1%2C%22sn%22%3A%220000000000000072%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreieb5etwah3uz5pcs2baq5qnfvnl7vmyimtg3u3akximnkzrrae6sy%22%7D";
        mintNftRmrk = decodeURIComponent(mintNftRmrk);
        const tx = new Transaction_1.Transaction(Interactions_test_1.block, Interactions_test_1.txHash, Interactions_test_1.timestamp, Interactions_test_1.blockchain, Interactions_test_1.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(Interactions_test_1.blockchain, tx);
        const mintNft = rmrkReader.readInteraction(mintNftRmrk);
        expect(mintNft).toBeInstanceOf(MintNft_1.MintNft);
        //@ts-ignore
        const gossip = new GossiperFactory_1.GossiperFactory(mintNft, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();
        expect(gossiper).toBeInstanceOf(EventGossiper_1.EventGossiper);
        gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
        const assetEntities = canonizeManager.getAssetFactory().entityArray;
        const collectionEntities = canonizeManager.getAssetCollectionFactory().entityArray;
        const eventEntities = canonizeChain.eventFactory.entityArray;
        expect(assetEntities.length).toBeGreaterThan(0);
        expect(collectionEntities.length).toBeGreaterThan(0);
        expect(eventEntities.length).toBe(1);
        expect(eventEntities[0].getRefValue("quantity")).toBe("1");
        expect(eventEntities[0].getRefValue("txHash")).toBe(Interactions_test_1.txHash);
        expect(assetEntities[0].getRefValue(AssetFactory_1.AssetFactory.ASSET_NAME)).toBe("Cursed AI | #59");
    });
    test("gossip order", () => {
        const listRmrk = "rmrk::LIST::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001::1";
        const tx = new Transaction_1.Transaction(Interactions_test_1.block, Interactions_test_1.txHash, Interactions_test_1.timestamp, Interactions_test_1.blockchain, Interactions_test_1.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(Interactions_test_1.blockchain, tx);
        const list = rmrkReader.readInteraction(listRmrk);
        expect(list).toBeInstanceOf(List_1.List);
        //@ts-ignore
        const gossip = new GossiperFactory_1.GossiperFactory(list, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();
        expect(gossiper).toBeInstanceOf(OrderGossiper_1.OrderGossiper);
        gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
        const orderEntities = canonizeChain.orderFactory.entityArray;
        expect(orderEntities.length).toBe(1);
        expect(orderEntities[0].getRefValue(BlockchainOrderFactory_1.BlockchainOrderFactory.BUY_TOTAL)).toBe("1");
        //@ts-ignore
        expect(orderEntities[0].getJoinedEntitiesOnVerb(BlockchainOrderFactory_1.BlockchainOrderFactory.EVENT_SOURCE_ADDRESS)[0].getAddress()).toBe(Interactions_test_1.source);
        expect(orderEntities[0].getJoinedEntitiesOnVerb(BlockchainOrderFactory_1.BlockchainOrderFactory.ORDER_SELL_CONTRACT)[0].getRefValue('id')).toBe("5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL");
    });
    test("gossip emote", () => {
        const emoteRmrk = "rmrk::EMOTE::1.0.0::5105000-0aff6865bed3a66b-DLEP-DL15-0000000000000001::1F389";
        const tx = new Transaction_1.Transaction(Interactions_test_1.block, Interactions_test_1.txHash, Interactions_test_1.timestamp, Interactions_test_1.blockchain, Interactions_test_1.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(Interactions_test_1.blockchain, tx);
        const emote = rmrkReader.readInteraction(emoteRmrk);
        expect(emote).toBeInstanceOf(Emote_1.Emote);
        //@ts-ignore
        const gossip = new GossiperFactory_1.GossiperFactory(emote, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();
        expect(gossiper).toBeInstanceOf(EmoteGossiper_1.EmoteGossiper);
        gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
        const emoteEntities = canonizeChain.emoteFactory.entityArray;
        expect(emoteEntities[0].getRefValue(BlockchainEmoteFactory_1.BlockchainEmoteFactory.EMOTE_UNICODE)).toBe(emoteRmrk.split('::').pop());
        //@ts-ignore
        expect(emoteEntities[0].getJoinedEntitiesOnVerb(BlockchainEmoteFactory_1.BlockchainEmoteFactory.EMOTE_SOURCE_ADDRESS)[0].getAddress()).toBe(Interactions_test_1.source);
    });
    test("gossip changeIssuer", () => {
        const changeIssuerRmrk = "rmrk::CHANGEISSUER::1.0.0::0aff6865bed3a66b-DLEP::HviHUSkM5SknXzYuPCSfst3CXK4Yg6SWeroP6TdTZBZJbVT";
        const tx = new Transaction_1.Transaction(Interactions_test_1.block, Interactions_test_1.txHash, Interactions_test_1.timestamp, Interactions_test_1.blockchain, Interactions_test_1.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(Interactions_test_1.blockchain, tx);
        const changeIssuer = rmrkReader.readInteraction(changeIssuerRmrk);
        expect(changeIssuer).toBeInstanceOf(ChangeIssuer_1.ChangeIssuer);
        //@ts-ignore
        const gossip = new GossiperFactory_1.GossiperFactory(changeIssuer, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();
        expect(gossiper).toBeInstanceOf(ChangeIssuerGossiper_1.ChangeIssuerGossiper);
        gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
        const changeIssuerEntities = canonizeChain.changeIssuerFactory.entityArray;
        expect(changeIssuerEntities[0].getRefValue(ChangeIssuerFactory_1.ChangeIssuerFactory.COLLECTION_ID)).toBe("0aff6865bed3a66b-DLEP");
        //@ts-ignore
        expect(changeIssuerEntities[0].getJoinedEntitiesOnVerb(ChangeIssuerFactory_1.ChangeIssuerFactory.EVENT_SOURCE_ADDRESS)[0].getAddress()).toBe(Interactions_test_1.source);
        //@ts-ignore
        expect(changeIssuerEntities[0].getJoinedEntitiesOnVerb(ChangeIssuerFactory_1.ChangeIssuerFactory.NEW_ISSUER)[0].getAddress()).toBe(changeIssuerRmrk.split('::').pop());
    });
});
//# sourceMappingURL=Gossiper.test.js.map