"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jetski_1 = require("../src/Jetski/Jetski");
const Kusama_1 = require("../src/Blockchains/Kusama");
const Mint_1 = require("../src/Remark/Interactions/Mint");
test('Test for Mint', async () => {
    const block = 8920434;
    const blockchain = new Kusama_1.Kusama();
    const jetski = new Jetski_1.Jetski(blockchain);
    const api = await jetski.getApi();
    jetski.getBlockContent(block, api).then((inter) => {
        const interaction = inter.pop();
        expect(interaction).toBeInstanceOf(Mint_1.Mint);
    });
});
//# sourceMappingURL=Interactions.test.js.map