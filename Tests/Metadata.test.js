"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../src/Remark/Transaction");
const RmrkReader_1 = require("../src/Jetski/RmrkReader");
const Mint_1 = require("../src/Remark/Interactions/Mint");
const Interactions_test_1 = require("./Interactions.test");
const MetaData_1 = require("../src/Remark/MetaData");
describe("metadata and external call", () => {
    test("call meta on Object", async () => {
        // High level test, meta must be called and add to Mint
        var _a, _b, _c, _d;
        const metaToCall = [];
        let mintRmrk = "RMRK::MINT::1.0.0::%7B%22name%22%3A%22%5C%22Kulupu%20NOT%20dead%5C%22%22%2C%22max%22%3A0%2C%22issuer%22%3A%22DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu%22%2C%22symbol%22%3A%22KULUPUNOTDEAD%22%2C%22id%22%3A%22240f37351b4ec74a1b-KULUPUNOTDEAD%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i%22%7D";
        mintRmrk = decodeURIComponent(mintRmrk);
        const tx = new Transaction_1.Transaction(Interactions_test_1.block, Interactions_test_1.txHash, Interactions_test_1.timestamp, Interactions_test_1.blockchain, Interactions_test_1.source);
        const rmrkReader = new RmrkReader_1.RmrkReader(Interactions_test_1.blockchain, tx);
        const mint = rmrkReader.readInteraction(mintRmrk);
        expect(mint).toBeDefined();
        expect(mint).toBeInstanceOf(Mint_1.Mint);
        if (mint instanceof Mint_1.Mint) {
            metaToCall.push(mint);
            const interactWithMeta = await MetaData_1.MetaData.getMetaOnArray(metaToCall);
            const mintWithMeta = interactWithMeta.pop();
            expect(mintWithMeta).toBeInstanceOf(Mint_1.Mint);
            if (mintWithMeta instanceof Mint_1.Mint) {
                expect((_a = mintWithMeta.collection) === null || _a === void 0 ? void 0 : _a.metaData).toBeDefined();
                expect((_b = mintWithMeta.collection) === null || _b === void 0 ? void 0 : _b.metaData).toBeInstanceOf(MetaData_1.MetaData);
                expect((_d = (_c = mintWithMeta.collection) === null || _c === void 0 ? void 0 : _c.metaData) === null || _d === void 0 ? void 0 : _d.image).toBe(Interactions_test_1.metaData.image);
            }
        }
    });
    test("low level call", async () => {
        // Low level test, Metadata.callAllMeta() must call array of URLs argument and return MetadataCalls[]
        const shortUrl = 'ipfs://ipfs/bafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i';
        const expectedUrl = "https://cloudflare-ipfs.com/ipfs/bafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i";
        const expectedImgUrl = "https://cloudflare-ipfs.com/ipfs/bafybeia3lxpjgh6grt2vxs37ufydgb3bkb6gwumxtofmx3rbrf3g6os5tm";
        const expectedExternalUrl = "https://singular.rmrk.app";
        const url = MetaData_1.MetaData.getCorrectUrl(shortUrl);
        expect(url).toBe(expectedUrl);
        const allCalled = await MetaData_1.MetaData.callAllMeta([url]);
        expect(allCalled).toBeDefined();
        //@ts-ignore
        const called = allCalled.pop();
        expect(called.url).toBe(expectedUrl);
        expect(called.meta).toBeInstanceOf(MetaData_1.MetaData);
        expect(called.meta.image).toBe(expectedImgUrl);
        expect(called.meta.external_url).toBe(expectedExternalUrl);
    });
});
//# sourceMappingURL=Metadata.test.js.map