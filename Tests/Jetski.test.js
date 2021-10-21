"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jetski_1 = require("../src/Jetski/Jetski");
const Mint_1 = require("../src/Remark/Interactions/Mint");
const Collection_1 = require("../src/Remark/Entities/Collection");
const MetaData_1 = require("../src/Remark/MetaData");
const MintNft_1 = require("../src/Remark/Interactions/MintNft");
const Asset_1 = require("../src/Remark/Entities/Asset");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const Interactions_test_1 = require("./Interactions.test");
const blockTest = 8920434;
const eggTest = 6802595;
function getRandomNumber(max, min = 1) {
    return Math.floor(Math.random() * (max - min) + min);
}
describe("jetski tests", () => {
    test('polkadot API', async () => {
        const jetski = new Jetski_1.Jetski(Interactions_test_1.blockchain);
        const api = await jetski.getApi();
        expect(api.isReady).toBeTruthy();
        expect(api.isConnected).toBeTruthy();
        const blockHash = await api.rpc.chain.getBlockHash(blockTest);
        expect(blockHash).toBeDefined();
        const block = await api.rpc.chain.getBlock(blockHash);
        expect(block).toBeDefined();
        const extrinsic = block.block.extrinsics;
        expect(extrinsic).toBeDefined();
        expect(extrinsic.length).toBeGreaterThan(0);
    }, 15000);
    test('get Mint on block', async () => {
        var _a, _b, _c, _d;
        const jetski = new Jetski_1.Jetski(Interactions_test_1.blockchain);
        const api = await jetski.getApi();
        const content = await jetski.getBlockContent(8920434, api);
        const expectedMint = content.pop();
        expect(expectedMint).toBeDefined();
        expect(expectedMint).toBeInstanceOf(Mint_1.Mint);
        if (expectedMint instanceof Mint_1.Mint) {
            (_a = expectedMint.collection) === null || _a === void 0 ? void 0 : _a.addMetadata(Interactions_test_1.metaData);
            expect(expectedMint.getEntity()).toBeDefined();
            expect(expectedMint.getEntity()).toBeInstanceOf(Collection_1.Collection);
            expect((_b = expectedMint.collection) === null || _b === void 0 ? void 0 : _b.metaData).toBeInstanceOf(MetaData_1.MetaData);
            expect((_d = (_c = expectedMint.collection) === null || _c === void 0 ? void 0 : _c.metaData) === null || _d === void 0 ? void 0 : _d.url).toBe(Interactions_test_1.metaUrl);
            expect(expectedMint.transaction.blockId).toBe(Interactions_test_1.block);
            expect(expectedMint.transaction.source).toBe(Interactions_test_1.source);
        }
    }, 15000);
    test('get MintNft on block', async () => {
        var _a, _b, _c, _d;
        const jetski = new Jetski_1.Jetski(Interactions_test_1.blockchain);
        const api = await jetski.getApi();
        const content = await jetski.getBlockContent(9007965, api);
        const expectedMintNft = content.pop();
        expect(expectedMintNft).toBeDefined();
        expect(expectedMintNft).toBeInstanceOf(MintNft_1.MintNft);
        if (expectedMintNft instanceof MintNft_1.MintNft) {
            (_a = expectedMintNft.asset) === null || _a === void 0 ? void 0 : _a.addMetadata(Interactions_test_1.metaData);
            expect(expectedMintNft.getEntity()).toBeDefined();
            expect(expectedMintNft.getEntity()).toBeInstanceOf(Asset_1.Asset);
            expect(expectedMintNft.transaction.source).toBe(CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString);
            expect((_b = expectedMintNft.asset) === null || _b === void 0 ? void 0 : _b.metaData).toBeInstanceOf(MetaData_1.MetaData);
            expect((_d = (_c = expectedMintNft.asset) === null || _c === void 0 ? void 0 : _c.metaData) === null || _d === void 0 ? void 0 : _d.url).toBe(Interactions_test_1.metaUrl);
        }
    }, 20000);
    test('get egg on block', async () => {
        var _a, _b, _c, _d, _e;
        const jetski = new Jetski_1.Jetski(Interactions_test_1.blockchain);
        const api = await jetski.getApi();
        const expectedMetaName = "Kanaria Limited Edition Egg";
        const expectedMetaImage = "https://cloudflare-ipfs.com/ipfs/bafkreibow7tnhebndr4vqkb7hdnxxmo4ie7bjgb6nsyhb53jxcnpgyz4i4";
        const expectedLength = 3000;
        // batch with 3000 entries
        const interactions = await jetski.getBlockContent(eggTest, api);
        expect(interactions.length).toBe(expectedLength);
        // all entries are MintNft
        interactions.forEach(mintNft => {
            expect(mintNft).toBeInstanceOf(MintNft_1.MintNft);
        });
        const randInteract = interactions[getRandomNumber(interactions.length)];
        // check metadata on random entry
        expect(randInteract).toBeInstanceOf(MintNft_1.MintNft);
        expect((_a = randInteract.asset) === null || _a === void 0 ? void 0 : _a.metaData).toBeDefined();
        const randMeta = (_b = randInteract.asset) === null || _b === void 0 ? void 0 : _b.metaData;
        expect(randInteract.getEntity()).toBeInstanceOf(Asset_1.Asset);
        expect((_c = randInteract.asset) === null || _c === void 0 ? void 0 : _c.metaData).toBeDefined();
        expect(randMeta === null || randMeta === void 0 ? void 0 : randMeta.name).toBe(expectedMetaName);
        expect(randMeta === null || randMeta === void 0 ? void 0 : randMeta.image).toBe(expectedMetaImage);
        expect(randMeta === null || randMeta === void 0 ? void 0 : randMeta.description.length).toBeGreaterThan(1);
        // check metadata are the same on another random entry
        const secondRandInteract = interactions[getRandomNumber(interactions.length)];
        expect((_d = secondRandInteract.asset) === null || _d === void 0 ? void 0 : _d.metaData).toBeDefined();
        const secondRandMeta = (_e = secondRandInteract.asset) === null || _e === void 0 ? void 0 : _e.metaData;
        expect(secondRandMeta === null || secondRandMeta === void 0 ? void 0 : secondRandMeta.name).toEqual(randMeta === null || randMeta === void 0 ? void 0 : randMeta.name);
        expect(secondRandMeta === null || secondRandMeta === void 0 ? void 0 : secondRandMeta.url).toEqual(randMeta === null || randMeta === void 0 ? void 0 : randMeta.url);
        expect(secondRandMeta === null || secondRandMeta === void 0 ? void 0 : secondRandMeta.image).toEqual(randMeta === null || randMeta === void 0 ? void 0 : randMeta.image);
    }, 15000);
});
//# sourceMappingURL=Jetski.test.js.map