import {Jetski} from "../src/Jetski/Jetski";
import {Mint} from "../src/Remark/Interactions/Mint";
import {Collection} from "../src/Remark/Entities/Collection";
import {MetaData} from "../src/Remark/MetaData";
import {MintNft} from "../src/Remark/Interactions/MintNft";
import {Asset} from "../src/Remark/Entities/Asset";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {block, blockchain, metaData, metaUrl, source} from "./Interactions.test";

const blockTest: number = 8920434;
const eggTest: number = 6802595;

describe("jetski tests", ()=>{

    test('polkadot API', async ()=>{

        const jetski = new Jetski(blockchain);
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


    test('get Mint on block', async ()=>{

        const jetski = new Jetski(blockchain);
        const api = await jetski.getApi();

        // Increase timeout before jest stop testing without result
        const content = await jetski.getBlockContent(8920434, api);
        const expectedMint = content.pop();

        expect(expectedMint).toBeDefined();
        expect(expectedMint).toBeInstanceOf(Mint);

        if(expectedMint instanceof Mint){
            expectedMint.collection?.addMetadata(metaData);
            expect(expectedMint.getEntity()).toBeDefined();
            expect(expectedMint.getEntity()).toBeInstanceOf(Collection);
            expect(expectedMint.collection?.metaData).toBeInstanceOf(MetaData);
            expect(expectedMint.collection?.metaData?.url).toBe(metaUrl);

            expect(expectedMint.transaction.blockId).toBe(block);
            expect(expectedMint.transaction.source).toBe(source);
        }

    }, 15000);


    test('get MintNft on block', async ()=>{

        const jetski = new Jetski(blockchain);
        const api = await jetski.getApi();

        const content = await jetski.getBlockContent(9007965, api);
        const expectedMintNft = content.pop();

        expect(expectedMintNft).toBeDefined();
        expect(expectedMintNft).toBeInstanceOf(MintNft);

        if(expectedMintNft instanceof MintNft){
            expectedMintNft.asset?.addMetadata(metaData);
            expect(expectedMintNft.getEntity()).toBeDefined();
            expect(expectedMintNft.getEntity()).toBeInstanceOf(Asset);
            expect(expectedMintNft.transaction.source).toBe(CSCanonizeManager.mintIssuerAddressString);
            expect(expectedMintNft.asset?.metaData).toBeInstanceOf(MetaData);
            expect(expectedMintNft.asset?.metaData?.url).toBe(metaUrl);
        }

    }, 20000);


    test('get egg on block', async ()=>{

        const jetski = new Jetski(blockchain);
        const api = await jetski.getApi();

        // batch with 3000 entries
        const interactions: Array<MintNft> = await jetski.getBlockContent(eggTest, api);

        expect(interactions.length).toBe(3000);

        // all entries are MintNft
        interactions.forEach(mintNft=>{
            expect(mintNft).toBeInstanceOf(MintNft);
        })

        const random = getRandomNumber(1, interactions.length);
        const randInteract = interactions[random];

        // check metadata on random entry
        expect(randInteract).toBeInstanceOf(MintNft);
        expect(randInteract.asset?.metaData).toBeDefined();

        const randMeta = randInteract.asset?.metaData;

        expect(randInteract.getEntity()).toBeInstanceOf(Asset);
        expect(randInteract.asset?.metaData).toBeDefined();

        expect(randMeta?.name).toBe("Kanaria Limited Edition Egg");
        expect(randMeta?.image).toBe("https://cloudflare-ipfs.com/ipfs/bafkreibow7tnhebndr4vqkb7hdnxxmo4ie7bjgb6nsyhb53jxcnpgyz4i4");
        expect(randMeta?.description.length).toBeGreaterThan(1);

        // check metadata are the same on another random entry
        const secondRandom = getRandomNumber(1, interactions.length);
        const secondRandInteract = interactions[secondRandom];

        expect(secondRandInteract.asset?.metaData).toBeDefined();
        const secondRandMeta = secondRandInteract.asset?.metaData;

        expect(secondRandMeta?.name).toEqual(randMeta?.name);
        expect(secondRandMeta?.url).toEqual(randMeta?.url);
        expect(secondRandMeta?.image).toEqual(randMeta?.image);

    }, 15000);


})





function getRandomNumber(min: number, max: number){
    return Math.floor(Math.random() * (max - min) + min);
}