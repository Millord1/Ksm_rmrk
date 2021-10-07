import {Transaction} from "../src/Remark/Transaction";
import {RmrkReader} from "../src/Jetski/RmrkReader";
import {Mint} from "../src/Remark/Interactions/Mint";
import {block, blockchain, metaData, source, timestamp, txHash} from "./Interactions.test";
import {MetaData} from "../src/Remark/MetaData";
import {MetadataCalls} from "../src/Jetski/Jetski";



describe("metadata and external call", ()=>{


    test("call meta on Object", async ()=>{

        // High level test, meta must be called and add to Mint

        const metaToCall: Array<Mint> = [];

        let mintRmrk = "RMRK::MINT::1.0.0::%7B%22name%22%3A%22%5C%22Kulupu%20NOT%20dead%5C%22%22%2C%22max%22%3A0%2C%22issuer%22%3A%22DPbm8NTR117yZ7s1XoXy2BcecE4ZkdnPwhkjf4ci233vkQu%22%2C%22symbol%22%3A%22KULUPUNOTDEAD%22%2C%22id%22%3A%22240f37351b4ec74a1b-KULUPUNOTDEAD%22%2C%22metadata%22%3A%22ipfs%3A%2F%2Fipfs%2Fbafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i%22%7D";
        mintRmrk = decodeURIComponent(mintRmrk);
        const tx = new Transaction(block, txHash, timestamp, blockchain, source);

        const rmrkReader = new RmrkReader(blockchain, tx);
        const mint = rmrkReader.readInteraction(mintRmrk);

        expect(mint).toBeDefined();
        expect(mint).toBeInstanceOf(Mint);

        if(mint instanceof Mint){
            metaToCall.push(mint);

            const interactWithMeta = await MetaData.getMetaOnArray(metaToCall);
            const mintWithMeta = interactWithMeta.pop();

            expect(mintWithMeta).toBeInstanceOf(Mint);

            if(mintWithMeta instanceof Mint){
                expect(mintWithMeta.collection?.metaData).toBeDefined();
                expect(mintWithMeta.collection?.metaData).toBeInstanceOf(MetaData);
                expect(mintWithMeta.collection?.metaData?.image).toBe(metaData.image);
            }
        }

    });

    test("low level call", async ()=>{

        // Low level test, Metadata.callAllMeta() must call array of URLs argument and return MetadataCalls[]

        const shortUrl: string = 'ipfs://ipfs/bafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i';
        const expectedUrl: string = "https://cloudflare-ipfs.com/ipfs/bafkreibe6nd2u7mviltfaukvyowlov2wlwygn67fu7vcpfxxjlzmjcav3i";
        const expectedImgUrl: string = "https://cloudflare-ipfs.com/ipfs/bafybeia3lxpjgh6grt2vxs37ufydgb3bkb6gwumxtofmx3rbrf3g6os5tm";
        const expectedExternalUrl: string = "https://singular.rmrk.app";

        const url: string = MetaData.getCorrectUrl(shortUrl);

        expect(url).toBe(expectedUrl);

        const allCalled: MetadataCalls[] = await MetaData.callAllMeta([url]);

        expect(allCalled).toBeDefined();

        //@ts-ignore
        const called: MetadataCalls = allCalled.pop();

        expect(called.url).toBe(expectedUrl);
        expect(called.meta).toBeInstanceOf(MetaData);
        expect(called.meta.image).toBe(expectedImgUrl)
        expect(called.meta.external_url).toBe(expectedExternalUrl);

    });

})