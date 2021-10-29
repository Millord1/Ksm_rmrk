import {Kusama} from "../src/Blockchains/Kusama";
import {Transaction} from "../src/Remark/Transaction";
import {Mint} from "../src/Remark/Interactions/Mint";
import {MetaData, MetadataInputs} from "../src/Remark/MetaData";
import {MintNft} from "../src/Remark/Interactions/MintNft";
import {RmrkReader} from "../src/Jetski/RmrkReader";
import {Send} from "../src/Remark/Interactions/Send";
import {ChangeIssuer} from "../src/Remark/Interactions/ChangeIssuer";
import {Asset} from "../src/Remark/Entities/Asset";
import {Collection} from "../src/Remark/Entities/Collection";
import {Emote} from "../src/Remark/Interactions/Emote";
import {Consume} from "../src/Remark/Interactions/Consume";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {List} from "../src/Remark/Interactions/List";
import {Buy} from "../src/Remark/Interactions/Buy";
import {Jetski} from "../src/Jetski/Jetski";
import {ApiPromise} from "@polkadot/api";

export const txHash: string = "0x0b59dc959afc440ee937251d0344e74941a4ed43dc7e75246865299d5187b3f6";
export const timestamp: string = "1631780394";
export const source: string = "DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu";
export const block: number = 8920434;

export const metaUrl: string = "https://cloudflare-ipfs.com/ipfs/bafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i";
export const meta: MetadataInputs = {
    external_url : "https://singular.rmrk.app",
    image : "ipfs://ipfs/bafybeia3lxpjgh6grt2vxs37ufydgb3bkb6gwumxtofmx3rbrf3g6os5tm",
    description : "",
    name : "Kulupu NOT dead",
    attributes : [],
    background_color : "",
    animation_url : ""
}
export const metaData = new MetaData(metaUrl, meta);

export const blockchain = new Kusama();

describe('basic interactions', ()=>{

    test("Mint", ()=>{
       let mintRmrk = "RMRK::MINT::1.0.0::%7B%22name%22%3A%22%5C%22Kulupu%20NOT%20dead%5C%22%22%2C%22max%22%3A0%2C%22issuer%22%3A%22DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu%22%2C%22symbol%22%3A%22KULUPUNOTDEAD%22%2C%22id%22%3A%22240f37351b4ec74a1b-KULUPUNOTDEAD%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i%22%7D";
       mintRmrk = decodeURIComponent(mintRmrk);
       const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const mint = rmrkReader.readInteraction(mintRmrk);

        expect(mint).toBeDefined();
        expect(mint).toBeInstanceOf(Mint);

       if(mint instanceof Mint){
           mint.collection?.addMetadata(metaData);
           expect(mint.getEntity()).toBeDefined();
           expect(mint.getEntity()).toBeInstanceOf(Collection);
           expect(mint.collection?.metaData).toBeInstanceOf(MetaData);
           expect(mint.collection?.metaData?.url).toBe(metaUrl);

           expect(mint.transaction.blockId).toBe(block);
           expect(mint.transaction.source).toBe(source);
       }

    });

    test("MintNft", ()=>{
        let mintNftRmrk = "RMRK::MINTNFT::1.0.0::%7B%22collection%22%3A%2254adb573ab0a2f5b32-CURSEDAI%22%2C%22name%22%3A%22Cursed%20AI%20%7C%20%2359%22%2C%22instance%22%3A%22CURSED_AI_OR_59%22%2C%22transferable%22%3A1%2C%22sn%22%3A%220000000000000072%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreieb5etwah3uz5pcs2baq5qnfvnl7vmyimtg3u3akximnkzrrae6sy%22%7D";
        mintNftRmrk = decodeURIComponent(mintNftRmrk);
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const mintNft = rmrkReader.readInteraction(mintNftRmrk);

        expect(mintNft).toBeDefined();
        expect(mintNft).toBeInstanceOf(MintNft);

        if(mintNft instanceof MintNft){
            mintNft.asset?.addMetadata(metaData);
            expect(mintNft.getEntity()).toBeDefined();
            expect(mintNft.getEntity()).toBeInstanceOf(Asset);
            expect(mintNft.transaction.source).toBe(CSCanonizeManager.mintIssuerAddressString);
            expect(mintNft.asset?.metaData).toBeInstanceOf(MetaData);
            expect(mintNft.asset?.metaData?.url).toBe(metaUrl);
        }
    });

    test("Send", ()=>{
        const sendRmrk = "rmrk::SEND::1.0.0::5105000-0aff6865bed3a66b-DLEP-DL15-0000000000000001::H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y";
        const destination = sendRmrk.split("::").pop();
        const value: string = "1";

        const tx = new Transaction(block, txHash, timestamp, blockchain, source, destination, value);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const send = rmrkReader.readInteraction(sendRmrk);

        expect(send).toBeDefined();
        expect(send).toBeInstanceOf(Send);

        if(send instanceof Send){
            expect(send.getEntity()).toBeDefined();
            expect(send.getEntity()).toBeInstanceOf(Asset);
            expect(send.asset?.contractId).toBe("5105000-0aff6865bed3a66b-DLEP-DL15");
            expect(send.asset?.token).toBeDefined();
            expect(send.asset?.token.sn).toBe("0000000000000001");

            expect(send.transaction.destination).toBe(destination);
            expect(send.transaction.value).toBe(value);
        }
    });

    test("ChangeIssuer", ()=>{

        const changeIssuerRmrk: string = "rmrk::CHANGEISSUER::1.0.0::0aff6865bed3a66b-DLEP::HviHUSkM5SknXzYuPCSfst3CXK4Yg6SWeroP6TdTZBZJbVT";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const changeIssuer = rmrkReader.readInteraction(changeIssuerRmrk);

        expect(changeIssuer).toBeDefined();
        expect(changeIssuer).toBeInstanceOf(ChangeIssuer);

        if(changeIssuer instanceof ChangeIssuer){
            expect(changeIssuer.newOwner).toBe(changeIssuer.splitRmrk().pop());
            expect(changeIssuer.collectionId).toBe("0aff6865bed3a66b-DLEP")
        }

    });

    test("Emote", ()=>{
        const emoteRmrk: string = "rmrk::EMOTE::1.0.0::5105000-0aff6865bed3a66b-DLEP-DL15-0000000000000001::1F389";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const emote = rmrkReader.readInteraction(emoteRmrk);

        expect(emote).toBeDefined();
        expect(emote).toBeInstanceOf(Emote);

        if(emote instanceof Emote){
            expect(emote.getEntity()).toBeInstanceOf(Asset);
            expect(emote.unicode).toBe(emoteRmrk.split('::').pop());
            expect(emote.asset?.contractId).toBe("5105000-0aff6865bed3a66b-DLEP-DL15");
        }
    });

    test("Consume", ()=>{
        const consumeRmrk: string = "rmrk::CONSUME::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const consume = rmrkReader.readInteraction(consumeRmrk);

        expect(consume).toBeDefined();
        expect(consume).toBeInstanceOf(Consume);

        if(consume instanceof Consume){
            expect(consume.transaction.destination).toBe(CSCanonizeManager.mintIssuerAddressString);
            expect(consume.getEntity()).toBeInstanceOf(Asset);
            expect(consume.asset?.contractId).toBe("5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL");
        }
    });

    test("List", ()=>{
        const listRmrk: string = "rmrk::LIST::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001::1";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const list = rmrkReader.readInteraction(listRmrk);

        expect(list).toBeDefined();
        expect(list).toBeInstanceOf(List);

        if(list instanceof List){
            expect(list.getEntity()).toBeInstanceOf(Asset);
            const value = listRmrk.split('::').pop();
            expect(list.value).toBe(Number(value));
            expect(list.asset?.token.transferable).toBeTruthy();
        }
    });

    test("Buy", ()=>{
        const buyRmrk: string = "rmrk::BUY::1.0.0::5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL-0000000000000001";
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const buy = rmrkReader.readInteraction(buyRmrk);

        expect(buy).toBeDefined();
        expect(buy).toBeInstanceOf(Buy);

        if(buy instanceof Buy){
            expect(buy.getEntity()).toBeInstanceOf(Asset)
            expect(buy.asset?.contractId).toBe("5105000-0aff6865bed3a66b-VALHELLO-POTION_HEAL");
        }
    });


    test("Buy with crypto sent", async ()=>{

        const blockchain = new Kusama();
        const jetski = new Jetski(blockchain);

        let api: ApiPromise = await jetski.getApi();

        const rmrks = await jetski.getBlockContent(9752553, api);

        expect(rmrks.length).toBe(1);

        rmrks.forEach((rmrk)=>{
            if(rmrk instanceof Buy){
                expect(rmrk.transaction.destination).toBe('DTEzX9Njj4GTSmTMfg2oc32bE5g7U8eNrecK3BffBk9yu6X');
                expect(rmrk.transaction.value).toBe(9800000000);
                expect(rmrk.getEntity()).toBeInstanceOf(Asset);
            }
        })

    }, 15000);

});
