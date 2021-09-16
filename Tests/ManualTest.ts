import {Kusama} from "../src/Blockchains/Kusama";
import {Jetski} from "../src/Jetski/Jetski";
import {ApiPromise} from "@polkadot/api";
import {Asset} from "../src/Remark/Entities/Asset";
import {Mint} from "../src/Remark/Interactions/Mint";
import {MintNft} from "../src/Remark/Interactions/MintNft";
import {Transaction} from "../src/Remark/Transaction";
import {RmrkReader} from "../src/Jetski/RmrkReader";

async function makeTest()
{

    const txHash: string = "0x0b59dc959afc440ee937251d0344e74941a4ed43dc7e75246865299d5187b3f6";
    const timestamp: string = "1631780394";
    const source: string = "DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu";
    const block: number = 8920434;
    const destination: string = "HviHUSkM5SknXzYuPCSfst3CXK4Yg6SWeroP6TdTZBZJbVT";
    const value: string = "1";

    const blockchain = new Kusama();

    const sendRmrk = "rmrk::BUY::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001";
    const tx = new Transaction(block, txHash, timestamp, blockchain, source);

    const rmrkReader = new RmrkReader(blockchain, tx);
    const rmrkObj = rmrkReader.readInteraction(sendRmrk);

    console.log(rmrkObj);
    process.exit();
}

makeTest();