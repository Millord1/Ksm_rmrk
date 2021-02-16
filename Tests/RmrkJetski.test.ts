import {RmrkJetski} from "../Kusama/RmrkJetski.js";
import {Kusama} from "../classes/Blockchains/Kusama.js";
import {MintNft} from "../classes/Rmrk/Interactions/MintNft.js";
import {Metadata} from "../classes/Metadata.js";

const chain = new Kusama();
const jetSki = new RmrkJetski(chain);

const batchRmrk = 6095478;
const classicRmrk = 6221364;


const batchNames = [
    'Shimano Alfine 11',
    'Microshift Inter 11',
    'Brakes TRP Spyre',
    'Booda Hiker FRONT',
    'Booda Bike Hiker Overview'
]


const batchContent = async () => {

    const api = await jetSki.getApi();
    jetSki.getRmrks(batchRmrk, api).then(result => {

        let i = 0;
        for (const rmrk of result){

            test('verification of instance', ()=>{
                const mintNft = rmrk instanceof MintNft;
                expect(mintNft).toBe(true);
            })

            if(rmrk instanceof MintNft){

                test('scan block of batch ' + batchRmrk + ' element ' + i, ()=>{
                    let hash = rmrk.transaction.txHash;
                    hash = hash.slice(hash.length -2, 2);
                    expect(hash).toBe(hash + '-' + i);
                })

                test('verif the name', ()=>{
                    const name = rmrk.nft.name
                    expect(batchNames.includes(name)).toBe(true);
                })

                test('verif assetId', ()=>{
                    const baseAssetId = '6095478-0E76E3AC15B4C1FA1E-BOODAHIKER';
                    expect(rmrk.nft.assetId.includes(baseAssetId)).toBe(true);
                })

                test('verif sender', ()=>{
                    expect(rmrk.transaction.source).toBe('CuHWHNcBt3ASMVSJmcJyiBWGxxiWLyjYoYbGjfhL4ovoeSd');
                })

                test('metadata', ()=>{
                    const meta = rmrk.nft.metaDataContent;
                    const isNull = meta === null;
                    expect(isNull).toBe(false);

                    const description = 'If you like the quality feeling that a bike can give, this is the best choice for you.';
                    expect(meta?.description).toBe(description);

                    if(meta instanceof Metadata){
                        const imgUrl = meta?.image
                        const protocol = imgUrl.slice(0,4);
                        expect(protocol).toBe('ipfs');
                    }
                })

            }

            i += 1;
        }
    });

}