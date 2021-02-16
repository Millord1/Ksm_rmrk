import {RmrkJetski} from "../Kusama/RmrkJetski.js";
import {Kusama} from "../classes/Blockchains/Kusama.js";
import {MintNft} from "../classes/Rmrk/Interactions/MintNft.js";
import {Metadata} from "../classes/Metadata.js";
import {Mint} from "../classes/Rmrk/Interactions/Mint.js";


export const testJetski = async ()=>{

    const batchRmrk = 6095478;
    const classicRmrk = 6221364;


    const batchNames: Array<string> = [
        'Shimano Alfine 11',
        'Microshift Inter 11',
        'Brakes TRP Spyre',
        'Booda Hiker FRONT',
        'Booda Bike Hiker Overview'
    ];


    const batchDescriptions: Array<string> = [
        'Thanks to the Microshift Inter 11 working with the Alfine 11 gear hub shifting through gears is a real experience.',
        'Microshift Inter 11',
        'Disc brakes TRP Spyre 160-160',
        'Gravel bike to ride in technical position',
        'If you like the quality feeling that a bike can give this is the best choice for you.'
    ];


    const jetSki = new RmrkJetski(new Kusama());

    const api = await jetSki.getApi();


    let rmrkTests: Array<object> = [];

    jetSki.getRmrks(classicRmrk, api).then(result=>{

        if(typeof result == "object"){

            // Test Instance
            const isMint: boolean = result[0] instanceof Mint;
            rmrkTests.push({instanceTest: isMint});

            if(result[0] instanceof Mint){

                const rmrk = result[0];

                // Test sender
                const source = 'Dx6nVUy6f2znn4ZwNZ3TGbEyUz3FLbCRGQGKAut4LxjCVRs';
                rmrkTests.push({senderTest: rmrk.transaction.source === source});

                // Test Block ID
                rmrkTests.push({blockIdTest: rmrk.transaction.blockId === 6221364});

                // Test name
                rmrkTests.push({nameTest: rmrk.collection.name === 'Biotech'});

                // Test collection ID
                rmrkTests.push({collectionIdTest: rmrk.collection.contract.id === '3CD8C53D036D48B952-BIO'});

                // Test MetaData
                const image = 'ipfs://ipfs/QmTB3igPJrVtyFt93Gwmgb39RxNXD52LM2fqU7CbmSXsGR';
                rmrkTests.push({metaDataTest: rmrk.collection.metaDataContent?.image === image});
            }
        }

        console.log('Remark Tests :')
        console.log(rmrkTests);

    })



    jetSki.getRmrks(batchRmrk, api).then(result=>{

        let i: number = 1;

        let allBatchTests: Array<Array<object>> = [];

        for(const rmrk of result){

            let batchTests: Array<object> = [];

            if(rmrk instanceof MintNft){

                // Test tx hash
                let txHash = rmrk.transaction.txHash;
                const hash = '0x508d500dbb7cfccc9c5d05c9c45ac8fc76ccb1811e82ff557dfedbed15d9f80a';
                batchTests.push({hashTest: hash + '-' + i === txHash})

                // Test Name
                const name = rmrk.nft.name;
                batchTests.push({nameTest: batchNames.includes(name)});

                // Test Asset ID
                const assetID = '6095478-0E76E3AC15B4C1FA1E-BOODAHIKER'
                batchTests.push({assetIDTest: rmrk.nft.assetId.includes(assetID)});

                // Test sender
                batchTests.push({senderTest: rmrk.transaction.source === 'CuHWHNcBt3ASMVSJmcJyiBWGxxiWLyjYoYbGjfhL4ovoeSd'});

                // Test MetaData
                batchTests.push({metaNotNull: rmrk.nft.metaDataContent != null});

                const description = rmrk.nft.metaDataContent?.description;

                batchTests.push({descriptionExists: typeof description === "string"});

                if(typeof description === "string"){
                    batchTests.push({descriptionTest: batchDescriptions.includes(description)});
                }

                // Test Protocol
                if(rmrk.nft.metaDataContent instanceof Metadata){
                    const protocol = rmrk.nft.metaDataContent.image.slice(0,4);
                    batchTests.push({protocolTest: protocol === 'ipfs'});
                }

            }

            allBatchTests.push(batchTests);
            i += 1;
        }

        console.log('Batch Tests : ')
        let j: number = 1;

        allBatchTests.forEach((obj=>{
            console.log('Remark : ' + j);
            console.log(obj);
            j += 1;
        }))

        process.exit();

    })



}