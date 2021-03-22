"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KusamaBlockchain_js_1 = require("./sandra/src/CSCannon/Kusama/KusamaBlockchain.js");
const CSCanonizeManager_js_1 = require("./sandra/src/CSCannon/CSCanonizeManager.js");
const RmrkContractStandard_js_1 = require("./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8';
let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
let sandra = canonizeManager.getSandra();
let kusama = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
canonizeManager.flushWithBlockchainSupport([kusama]).then(r => {
    console.log("flushed and added blockchain support");
    console.log(r);
}).catch(err => { console.log(err); });
console.log(kusama.addressFactory.entityByRevValMap);
let myCollection = canonizeManager.createCollection({ id: 'my veryfirst collection', imageUrl: 'https://picsum.photos/400', name: 'my veryfirst collection', description: 'dolor' });
let myAsset = canonizeManager.createAsset({ assetId: 'A great asset I made', imageUrl: "https://picsum.photos/400", description: 'hello' });
let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');
myAsset.bindCollection(myCollection);
myCOntract.bindToCollection(myCollection);
let rmrkToken = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager);
rmrkToken.setSn("0000000000000003");
let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);
tokenPath.bindToAssetWithContract(myCOntract, myAsset);
console.log(myAsset.getRefValue('assetId'));
myAsset.setImageUrl('myNew');
console.log(myAsset.getImageUrl());
let myAsset1 = canonizeManager.createAsset({ assetId: 'a1', imageUrl: "https://picsum.photos/400", description: 'hello' });
let myAsset2 = canonizeManager.createAsset({ assetId: 'a2', imageUrl: "https://picsum.photos/400", description: 'hello' });
let myAsset3 = canonizeManager.createAsset({ assetId: 'a3', imageUrl: "https://picsum.photos/400", description: 'hello' });
let found = canonizeManager.getAssetFactory().getEntitiesWithRefValue('description', 'hello');
if (found) {
    console.log("XXXXXXXXXXXXXXX");
    console.log("found");
    console.log("XXXXXXXXXXXXXXX");
    console.log(found);
}
//# sourceMappingURL=bootstrapCollections.js.map