import {ApiPromise} from "@polkadot/api";
import {Jetski} from "../src/Jetski/Jetski";
import {Kusama} from "../src/Blockchains/Kusama";
import {Mint} from "../src/Remark/Interactions/Mint";


test('Test for Mint', async ()=>{

    const block: number = 8920434;
    const blockchain = new Kusama();
    const jetski = new Jetski(blockchain);
    const api: ApiPromise = await jetski.getApi();

    jetski.getBlockContent(block, api).then((r)=>{
        const interaction = r.pop();
        expect(interaction).toBeInstanceOf(Mint);
    })

})