import {RemarkConverter} from "./RemarkConverter.js";
import {RmrkJetski} from "./Kusama/RmrkJetski.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {getJwt} from "./StartScan.js";
import {stringToHex} from "@polkadot/util";
import {Transaction} from "./classes/Transaction.js";

class RmrkConverterTest
{


    public static async mintNftFromCanonizer()
    {

        const jwt = getJwt();

        let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});

        let sandra = canonizeManager.getSandra();
        let kusama = new KusamaBlockchain(sandra);

        let myCollection = canonizeManager.createCollection({id:'my veryfirst collection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

        let myAsset = canonizeManager.createAsset({assetId:'A great asset I made',imageUrl:"https://picsum.photos/400",description:'hello', metadataUrl:'ipfs:ipfs/1234567890', name:'asset name'});
        let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');

        myAsset.bindCollection(myCollection);
        myCOntract.bindToCollection(myCollection);

        let rmrkToken = new RmrkContractStandard(canonizeManager);
        rmrkToken.setSn("0000000000000003");
        let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);

        tokenPath.bindToAssetWithContract(myCOntract,myAsset);


        const rmrkConverter = new RemarkConverter(sandra);
        const myRmrk = rmrkConverter.createMintNftRemark(myAsset, myCollection, '001', true);

        console.log(myRmrk);
        console.log(stringToHex(myRmrk));

        return stringToHex(myRmrk);
    }


    public static async mintFromCanonizer()
    {
        const jwt = getJwt();
        let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
        let sandra = canonizeManager.getSandra();

        let myCollection = canonizeManager.createCollection({id:'my veryfirst collection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

        const rmrkConverter = new RemarkConverter(sandra);
        const myRmrk = rmrkConverter.createMintRemark(myCollection, 50, 'ipfs:ipfs/123456789', '0A123456');


        console.log(myRmrk);
        console.log(stringToHex(myRmrk));

        return stringToHex(myRmrk);
    }


    public static async sendFromCanonizer()
    {

        const jwt = getJwt();

        let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});

        let sandra = canonizeManager.getSandra();
        let kusama = new KusamaBlockchain(sandra);

        let myCollection = canonizeManager.createCollection({id:'my veryfirst collection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

        let myAsset = canonizeManager.createAsset({assetId:'A great asset I made',imageUrl:"https://picsum.photos/400",description:'hello', metadataUrl:'ipfs:ipfs/1234567890', name:'asset name'});
        let myCOntract = kusama.contractFactory.getOrCreate('123456789-241B8516516F381A-FRACTAL');

        myAsset.bindCollection(myCollection);
        myCOntract.bindToCollection(myCollection);

        let rmrkToken = new RmrkContractStandard(canonizeManager);
        rmrkToken.setSn("0000000000000003");
        let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);

        tokenPath.bindToAssetWithContract(myCOntract,myAsset);


        const rmrkConverter = new RemarkConverter(sandra);
        const myRmrk = rmrkConverter.createSendRemark(myAsset, myCOntract, kusama, '000001', 'you');

        console.log(myRmrk);
        console.log(stringToHex(myRmrk));

        return stringToHex(myRmrk);


    }


    public static async revertRemark(rmrk: string)
    {

        const tx = new Transaction(new Kusama(), 123456, 'myTxHash', '123456789', 'Me', null);

        const scan = new RmrkJetski(new Kusama());
        const obj = await scan.rmrkToObject(rmrk, tx);

        console.log(obj);
    }

}

// Mint NFT
RmrkConverterTest.mintNftFromCanonizer().then(r=>{
    RmrkConverterTest.revertRemark(r);
});

// Mint
RmrkConverterTest.mintFromCanonizer().then(r=>{
    console.log(r);
    RmrkConverterTest.revertRemark(r);
})

// Send
RmrkConverterTest.sendFromCanonizer().then(r=>{
    RmrkConverterTest.revertRemark(r);
})
