"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RemarkConverter_js_1 = require("./RemarkConverter.js");
const RmrkJetski_js_1 = require("./Kusama/RmrkJetski.js");
const Kusama_js_1 = require("./classes/Blockchains/Kusama.js");
const RmrkContractStandard_js_1 = require("./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js");
const CSCanonizeManager_js_1 = require("./sandra/src/CSCannon/CSCanonizeManager.js");
const KusamaBlockchain_js_1 = require("./sandra/src/CSCannon/Kusama/KusamaBlockchain.js");
const StartScan_js_1 = require("./StartScan.js");
const util_1 = require("@polkadot/util");
const Transaction_js_1 = require("./classes/Transaction.js");
class RmrkConverterTest {
    static async mintNftFromCanonizer() {
        const jwt = StartScan_js_1.getJwt();
        let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
        let sandra = canonizeManager.getSandra();
        let kusama = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
        let myCollection = canonizeManager.createCollection({ id: 'my veryfirst collection', imageUrl: 'https://picsum.photos/400', name: 'my veryfirst collection', description: 'dolor' });
        let myAsset = canonizeManager.createAsset({ assetId: 'A great asset I made', imageUrl: "https://picsum.photos/400", description: 'hello', metadataUrl: 'ipfs:ipfs/1234567890', name: 'asset name' });
        let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');
        myAsset.bindCollection(myCollection);
        myCOntract.bindToCollection(myCollection);
        let rmrkToken = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager);
        rmrkToken.setSn("0000000000000003");
        let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);
        tokenPath.bindToAssetWithContract(myCOntract, myAsset);
        const rmrkConverter = new RemarkConverter_js_1.RemarkConverter(sandra);
        const myRmrk = rmrkConverter.createMintNftRemark(myAsset, myCollection, '001', true);
        console.log(myRmrk);
        console.log(util_1.stringToHex(myRmrk));
        return util_1.stringToHex(myRmrk);
    }
    static async mintFromCanonizer() {
        const jwt = StartScan_js_1.getJwt();
        let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
        let sandra = canonizeManager.getSandra();
        let myCollection = canonizeManager.createCollection({ id: 'my veryfirst collection', imageUrl: 'https://picsum.photos/400', name: 'my veryfirst collection', description: 'dolor' });
        const rmrkConverter = new RemarkConverter_js_1.RemarkConverter(sandra);
        const myRmrk = rmrkConverter.createMintRemark(myCollection, 50, 'ipfs:ipfs/123456789', '0A123456');
        console.log(myRmrk);
        console.log(util_1.stringToHex(myRmrk));
        return util_1.stringToHex(myRmrk);
    }
    static async sendFromCanonizer() {
        const jwt = StartScan_js_1.getJwt();
        let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
        let sandra = canonizeManager.getSandra();
        let kusama = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
        let myCollection = canonizeManager.createCollection({ id: 'my veryfirst collection', imageUrl: 'https://picsum.photos/400', name: 'my veryfirst collection', description: 'dolor' });
        let myAsset = canonizeManager.createAsset({ assetId: 'A great asset I made', imageUrl: "https://picsum.photos/400", description: 'hello', metadataUrl: 'ipfs:ipfs/1234567890', name: 'asset name' });
        let myCOntract = kusama.contractFactory.getOrCreate('123456789-241B8516516F381A-FRACTAL');
        myAsset.bindCollection(myCollection);
        myCOntract.bindToCollection(myCollection);
        let rmrkToken = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager);
        rmrkToken.setSn("0000000000000003");
        let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);
        tokenPath.bindToAssetWithContract(myCOntract, myAsset);
        const rmrkConverter = new RemarkConverter_js_1.RemarkConverter(sandra);
        const myRmrk = rmrkConverter.createSendRemark(myAsset, myCOntract, kusama, '000001', 'you');
        console.log(myRmrk);
        console.log(util_1.stringToHex(myRmrk));
        return util_1.stringToHex(myRmrk);
    }
    static async revertRemark(rmrk) {
        const tx = new Transaction_js_1.Transaction(new Kusama_js_1.Kusama(), 123456, 'myTxHash', '123456789', 'Me', null);
        const scan = new RmrkJetski_js_1.RmrkJetski(new Kusama_js_1.Kusama());
        const obj = await scan.rmrkToObject(rmrk, tx);
        console.log(obj);
    }
}
// Mint NFT
RmrkConverterTest.mintNftFromCanonizer().then(r => {
    RmrkConverterTest.revertRemark(r);
});
// Mint
RmrkConverterTest.mintFromCanonizer().then(r => {
    console.log(r);
    RmrkConverterTest.revertRemark(r);
});
// Send
RmrkConverterTest.sendFromCanonizer().then(r => {
    RmrkConverterTest.revertRemark(r);
});
//# sourceMappingURL=RmrkConverterTest.js.map