"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Kusama_1 = require("../src/Blockchains/Kusama");
const Transaction_1 = require("../src/Remark/Transaction");
const RmrkReader_1 = require("../src/Jetski/RmrkReader");
async function makeTest() {
    const txHash = "0x0b59dc959afc440ee937251d0344e74941a4ed43dc7e75246865299d5187b3f6";
    const timestamp = "1631780394";
    const source = "DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu";
    const block = 8920434;
    const destination = "HviHUSkM5SknXzYuPCSfst3CXK4Yg6SWeroP6TdTZBZJbVT";
    const value = "1";
    const blockchain = new Kusama_1.Kusama();
    const sendRmrk = "rmrk::BUY::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001";
    const tx = new Transaction_1.Transaction(block, txHash, timestamp, blockchain, source);
    const rmrkReader = new RmrkReader_1.RmrkReader(blockchain, tx);
    const rmrkObj = rmrkReader.readInteraction(sendRmrk);
    console.log(rmrkObj);
    process.exit();
}
makeTest();
//# sourceMappingURL=ManualTest.js.map