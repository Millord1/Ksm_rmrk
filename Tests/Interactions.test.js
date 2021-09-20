"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchain = exports.metaData = exports.meta = exports.metaUrl = exports.block = exports.source = exports.timestamp = exports.txHash = void 0;
const Kusama_1 = require("../src/Blockchains/Kusama");
const Transaction_1 = require("../src/Remark/Transaction");
const Mint_1 = require("../src/Remark/Interactions/Mint");
const MetaData_1 = require("../src/Remark/MetaData");
const MintNft_1 = require("../src/Remark/Interactions/MintNft");
const RmrkReader_1 = require("../src/Jetski/RmrkReader");
const Send_1 = require("../src/Remark/Interactions/Send");
const ChangeIssuer_1 = require("../src/Remark/Interactions/ChangeIssuer");
const Asset_1 = require("../src/Remark/Entities/Asset");
const Collection_1 = require("../src/Remark/Entities/Collection");
const Emote_1 = require("../src/Remark/Interactions/Emote");
const Consume_1 = require("../src/Remark/Interactions/Consume");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const List_1 = require("../src/Remark/Interactions/List");
const Buy_1 = require("../src/Remark/Interactions/Buy");
exports.txHash = "0x0b59dc959afc440ee937251d0344e74941a4ed43dc7e75246865299d5187b3f6";
exports.timestamp = "1631780394";
exports.source = "DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu";
exports.block = 8920434;
exports.metaUrl = "https://cloudflare-ipfs.com/ipfs/bafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i";
exports.meta = {
    external_url: "https://singular.rmrk.app",
    image: "ipfs://ipfs/bafybeia3lxpjgh6grt2vxs37ufydgb3bkb6gwumxtofmx3rbrf3g6os5tm",
    description: "",
    name: "Kulupu NOT dead",
    attributes: [],
    background_color: "",
    animation_url: ""
};
exports.metaData = new MetaData_1.MetaData(exports.metaUrl, exports.meta);
exports.blockchain = new Kusama_1.Kusama();
describe('basic interactions', () => {
    test("Mint", () => {
        var _a, _b, _c, _d;
        let mintRmrk = "RMRK::MINT::1.0.0::%7B%22name%22%3A%22%5C%22Kulupu%20NOT%20dead%5C%22%22%2C%22max%22%3A0%2C%22issuer%22%3A%22DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu%22%2C%22symbol%22%3A%22KULUPUNOTDEAD%22%2C%22id%22%3A%22240f37351b4ec74a1b-KULUPUNOTDEAD%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i%22%7D";
        mintRmrk = decodeURIComponent(mintRmrk);
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const mint = rmrkReader.readInteraction(mintRmrk);
        expect(mint).toBeDefined();
        expect(mint).toBeInstanceOf(Mint_1.Mint);
        if (mint instanceof Mint_1.Mint) {
            (_a = mint.collection) === null || _a === void 0 ? void 0 : _a.addMetadata(exports.metaData);
            expect(mint.getEntity()).toBeDefined();
            expect(mint.getEntity()).toBeInstanceOf(Collection_1.Collection);
            expect((_b = mint.collection) === null || _b === void 0 ? void 0 : _b.metaData).toBeInstanceOf(MetaData_1.MetaData);
            expect((_d = (_c = mint.collection) === null || _c === void 0 ? void 0 : _c.metaData) === null || _d === void 0 ? void 0 : _d.url).toBe(exports.metaUrl);
            expect(mint.transaction.blockId).toBe(exports.block);
            expect(mint.transaction.source).toBe(exports.source);
        }
    });
    test("MintNft", () => {
        var _a, _b, _c, _d;
        let mintNftRmrk = "RMRK::MINTNFT::1.0.0::%7B%22collection%22%3A%2254adb573ab0a2f5b32-CURSEDAI%22%2C%22name%22%3A%22Cursed%20AI%20%7C%20%2359%22%2C%22instance%22%3A%22CURSED_AI_OR_59%22%2C%22transferable%22%3A1%2C%22sn%22%3A%220000000000000072%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreieb5etwah3uz5pcs2baq5qnfvnl7vmyimtg3u3akximnkzrrae6sy%22%7D";
        mintNftRmrk = decodeURIComponent(mintNftRmrk);
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const mintNft = rmrkReader.readInteraction(mintNftRmrk);
        expect(mintNft).toBeDefined();
        expect(mintNft).toBeInstanceOf(MintNft_1.MintNft);
        if (mintNft instanceof MintNft_1.MintNft) {
            (_a = mintNft.asset) === null || _a === void 0 ? void 0 : _a.addMetadata(exports.metaData);
            expect(mintNft.getEntity()).toBeDefined();
            expect(mintNft.getEntity()).toBeInstanceOf(Asset_1.Asset);
            expect((_b = mintNft.asset) === null || _b === void 0 ? void 0 : _b.metaData).toBeInstanceOf(MetaData_1.MetaData);
            expect((_d = (_c = mintNft.asset) === null || _c === void 0 ? void 0 : _c.metaData) === null || _d === void 0 ? void 0 : _d.url).toBe(exports.metaUrl);
        }
    });
    test("Send", () => {
        var _a, _b, _c;
        const sendRmrk = "rmrk::SEND::1.0.0::5105000-0aff6865bed3a66b-DLEP-DL15-0000000000000001::H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y";
        const destination = sendRmrk.split("::").pop();
        const value = "1";
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source, destination, value);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const send = rmrkReader.readInteraction(sendRmrk);
        expect(send).toBeDefined();
        expect(send).toBeInstanceOf(Send_1.Send);
        if (send instanceof Send_1.Send) {
            expect(send.getEntity()).toBeDefined();
            expect(send.getEntity()).toBeInstanceOf(Asset_1.Asset);
            expect((_a = send.asset) === null || _a === void 0 ? void 0 : _a.contractId).toBe("5105000-0aff6865bed3a66b-DLEP-DL15");
            expect((_b = send.asset) === null || _b === void 0 ? void 0 : _b.token).toBeDefined();
            expect((_c = send.asset) === null || _c === void 0 ? void 0 : _c.token.sn).toBe("0000000000000001");
            expect(send.transaction.destination).toBe(destination);
            expect(send.transaction.value).toBe(value);
        }
    });
    test("ChangeIssuer", () => {
        const changeIssuerRmrk = "rmrk::CHANGEISSUER::1.0.0::0aff6865bed3a66b-DLEP::HviHUSkM5SknXzYuPCSfst3CXK4Yg6SWeroP6TdTZBZJbVT";
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const changeIssuer = rmrkReader.readInteraction(changeIssuerRmrk);
        expect(changeIssuer).toBeDefined();
        expect(changeIssuer).toBeInstanceOf(ChangeIssuer_1.ChangeIssuer);
        if (changeIssuer instanceof ChangeIssuer_1.ChangeIssuer) {
            expect(changeIssuer.newOwner).toBe(changeIssuer.splitRmrk().pop());
            expect(changeIssuer.collectionId).toBe("0aff6865bed3a66b-DLEP");
        }
    });
    test("Emote", () => {
        var _a;
        const emoteRmrk = "rmrk::EMOTE::1.0.0::5105000-0aff6865bed3a66b-DLEP-DL15-0000000000000001::1F389";
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const emote = rmrkReader.readInteraction(emoteRmrk);
        expect(emote).toBeDefined();
        expect(emote).toBeInstanceOf(Emote_1.Emote);
        if (emote instanceof Emote_1.Emote) {
            expect(emote.getEntity()).toBeInstanceOf(Asset_1.Asset);
            expect(emote.unicode).toBe(emoteRmrk.split('::').pop());
            expect((_a = emote.asset) === null || _a === void 0 ? void 0 : _a.contractId).toBe("5105000-0aff6865bed3a66b-DLEP-DL15");
        }
    });
    test("Consume", () => {
        var _a;
        const consumeRmrk = "rmrk::CONSUME::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001";
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const consume = rmrkReader.readInteraction(consumeRmrk);
        expect(consume).toBeDefined();
        expect(consume).toBeInstanceOf(Consume_1.Consume);
        if (consume instanceof Consume_1.Consume) {
            expect(consume.transaction.destination).toBe(CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString);
            expect(consume.getEntity()).toBeInstanceOf(Asset_1.Asset);
            expect((_a = consume.asset) === null || _a === void 0 ? void 0 : _a.contractId).toBe("5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL");
        }
    });
    test("List", () => {
        var _a;
        const listRmrk = "rmrk::LIST::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001::1";
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const list = rmrkReader.readInteraction(listRmrk);
        expect(list).toBeDefined();
        expect(list).toBeInstanceOf(List_1.List);
        if (list instanceof List_1.List) {
            expect(list.getEntity()).toBeInstanceOf(Asset_1.Asset);
            const value = listRmrk.split('::').pop();
            expect(list.value).toBe(Number(value));
            expect((_a = list.asset) === null || _a === void 0 ? void 0 : _a.token.transferable).toBeTruthy();
        }
    });
    test("Buy", () => {
        var _a;
        const buyRmrk = "rmrk::BUY::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001";
        const tx = new Transaction_1.Transaction(exports.block, exports.txHash, exports.timestamp, exports.blockchain, exports.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(exports.blockchain, tx);
        const buy = rmrkReader.readInteraction(buyRmrk);
        expect(buy).toBeDefined();
        expect(buy).toBeInstanceOf(Buy_1.Buy);
        if (buy instanceof Buy_1.Buy) {
            expect(buy.getEntity()).toBeInstanceOf(Asset_1.Asset);
            expect((_a = buy.asset) === null || _a === void 0 ? void 0 : _a.contractId).toBe("5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL");
        }
    });
});
//# sourceMappingURL=Interactions.test.js.map