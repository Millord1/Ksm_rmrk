import {Transaction} from "../src/Remark/Transaction";
import {RmrkReader} from "../src/Jetski/RmrkReader";
import {block, blockchain, metaData, source, timestamp, txHash} from "./Interactions.test";
import {GossiperFactory} from "../src/Gossiper/GossiperFactory";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {Mint} from "../src/Remark/Interactions/Mint";
import {EntityGossiper} from "../src/Gossiper/EntityGossiper";
import {MintNft} from "../src/Remark/Interactions/MintNft";
import {EventGossiper} from "../src/Gossiper/EventGossiper";
import {List} from "../src/Remark/Interactions/List";
import {OrderGossiper} from "../src/Gossiper/OrderGossiper";
import {BlockchainOrderFactory} from "canonizer/src/canonizer/BlockchainOrderFactory";
import {AssetCollectionFactory} from "canonizer/src/canonizer/AssetCollectionFactory";
import {AssetFactory} from "canonizer/src/canonizer/AssetFactory";
import {Emote} from "../src/Remark/Interactions/Emote";
import {EmoteGossiper} from "../src/Gossiper/EmoteGossiper";
import {BlockchainEmoteFactory} from "canonizer/src/canonizer/BlockchainEmoteFactory";
import {ChangeIssuerFactory} from "canonizer/src/canonizer/ChangeIssuerFactory";
import {ChangeIssuer} from "../src/Remark/Interactions/ChangeIssuer";
import {ChangeIssuerGossiper} from "../src/Gossiper/ChangeIssuerGossiper";



const jwt = GossiperFactory.getJwt(blockchain.constructor.name, "gossip");

const canonizeManager = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl,jwt: jwt} });
const canonizeChain = GossiperFactory.getCanonizeChain(blockchain.constructor.name, canonizeManager.getSandra());


describe('gossiper test', ()=>{

    test('gossip collection', ()=>{

        let mintRmrk = "RMRK::MINT::1.0.0::%7B%22name%22%3A%22%5C%22Kulupu%20NOT%20dead%5C%22%22%2C%22max%22%3A0%2C%22issuer%22%3A%22DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu%22%2C%22symbol%22%3A%22KULUPUNOTDEAD%22%2C%22id%22%3A%22240f37351b4ec74a1b-KULUPUNOTDEAD%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i%22%7D";
        mintRmrk = decodeURIComponent(mintRmrk);
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const mint = rmrkReader.readInteraction(mintRmrk);

        if(mint instanceof Mint){
            mint.collection?.addMetadata(metaData);
        }

        //@ts-ignore
        expect(mint.collection.contract.collection).toBe("\"Kulupu NOT dead\"");

        expect(mint).toBeInstanceOf(Mint);

        // @ts-ignore
        const gossip = new GossiperFactory(mint, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();

        expect(gossiper).toBeInstanceOf(EntityGossiper);

        gossiper?.gossip();
        const collectionEntities = canonizeManager.getAssetCollectionFactory().entityArray

        expect(collectionEntities.length).toBeGreaterThan(0);
        expect(collectionEntities[0].getRefValue(AssetCollectionFactory.MAIN_NAME)).toBe("\"Kulupu NOT dead\"");
    });


    test("gossip asset", ()=>{

        let mintNftRmrk = "RMRK::MINTNFT::1.0.0::%7B%22collection%22%3A%2254adb573ab0a2f5b32-CURSEDAI%22%2C%22name%22%3A%22Cursed%20AI%20%7C%20%2359%22%2C%22instance%22%3A%22CURSED_AI_OR_59%22%2C%22transferable%22%3A1%2C%22sn%22%3A%220000000000000072%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreieb5etwah3uz5pcs2baq5qnfvnl7vmyimtg3u3akximnkzrrae6sy%22%7D";
        mintNftRmrk = decodeURIComponent(mintNftRmrk);
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const mintNft = rmrkReader.readInteraction(mintNftRmrk);

        expect(mintNft).toBeInstanceOf(MintNft);

        //@ts-ignore
        const gossip = new GossiperFactory(mintNft, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();

        expect(gossiper).toBeInstanceOf(EventGossiper);

        gossiper?.gossip();
        const assetEntities = canonizeManager.getAssetFactory().entityArray;
        const collectionEntities = canonizeManager.getAssetCollectionFactory().entityArray
        const eventEntities = canonizeChain.eventFactory.entityArray

        expect(assetEntities.length).toBeGreaterThan(0);
        expect(collectionEntities.length).toBeGreaterThan(0);
        expect(eventEntities.length).toBe(1);
        expect(eventEntities[0].getRefValue("quantity")).toBe("1");
        expect(eventEntities[0].getRefValue("txHash")).toBe(txHash);

        expect(assetEntities[0].getRefValue(AssetFactory.ASSET_NAME)).toBe("Cursed AI | #59");
    });


    test("gossip order", ()=>{

        const listRmrk: string = "rmrk::LIST::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001::1";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const list = rmrkReader.readInteraction(listRmrk);

        expect(list).toBeInstanceOf(List);

        //@ts-ignore
        const gossip = new GossiperFactory(list, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();

        expect(gossiper).toBeInstanceOf(OrderGossiper);

        gossiper?.gossip();

        const orderEntities = canonizeChain.orderFactory.entityArray;

        expect(orderEntities.length).toBe(1);
        expect(orderEntities[0].getRefValue(BlockchainOrderFactory.BUY_TOTAL)).toBe("1");
        //@ts-ignore
        expect(orderEntities[0].getJoinedEntitiesOnVerb(BlockchainOrderFactory.EVENT_SOURCE_ADDRESS)[0].getAddress()).toBe(source);
        expect(orderEntities[0].getJoinedEntitiesOnVerb(BlockchainOrderFactory.ORDER_SELL_CONTRACT)[0].getRefValue('id')).toBe("5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL");
    });


    test("gossip emote", ()=>{

        const emoteRmrk: string = "rmrk::EMOTE::1.0.0::5105000-0aff6865bed3a66b-DLEP-DL15-0000000000000001::1F389";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const emote = rmrkReader.readInteraction(emoteRmrk);

        expect(emote).toBeInstanceOf(Emote);

        //@ts-ignore
        const gossip = new GossiperFactory(emote, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();

        expect(gossiper).toBeInstanceOf(EmoteGossiper);

        gossiper?.gossip();

        const emoteEntities = canonizeChain.emoteFactory.entityArray;

        expect(emoteEntities[0].getRefValue(BlockchainEmoteFactory.EMOTE_UNICODE)).toBe(emoteRmrk.split('::').pop());
        //@ts-ignore
        expect(emoteEntities[0].getJoinedEntitiesOnVerb(BlockchainEmoteFactory.EMOTE_SOURCE_ADDRESS)[0].getAddress()).toBe(source);
    });


    test("gossip changeIssuer", ()=>{

        const changeIssuerRmrk: string = "rmrk::CHANGEISSUER::1.0.0::0aff6865bed3a66b-DLEP::HviHUSkM5SknXzYuPCSfst3CXK4Yg6SWeroP6TdTZBZJbVT";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const changeIssuer = rmrkReader.readInteraction(changeIssuerRmrk);

        expect(changeIssuer).toBeInstanceOf(ChangeIssuer);

        //@ts-ignore
        const gossip = new GossiperFactory(changeIssuer, canonizeManager, canonizeChain);
        const gossiper = gossip.getGossiper();

        expect(gossiper).toBeInstanceOf(ChangeIssuerGossiper);

        gossiper?.gossip();

        const changeIssuerEntities = canonizeChain.changeIssuerFactory.entityArray;

        expect(changeIssuerEntities[0].getRefValue(ChangeIssuerFactory.COLLECTION_ID)).toBe("0aff6865bed3a66b-DLEP");
        //@ts-ignore
        expect(changeIssuerEntities[0].getJoinedEntitiesOnVerb(ChangeIssuerFactory.EVENT_SOURCE_ADDRESS)[0].getAddress()).toBe(source);
        //@ts-ignore
        expect(changeIssuerEntities[0].getJoinedEntitiesOnVerb(ChangeIssuerFactory.NEW_ISSUER)[0].getAddress()).toBe(changeIssuerRmrk.split('::').pop());

    });


});

