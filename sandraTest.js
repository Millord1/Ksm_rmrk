"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KusamaBlockchain_js_1 = require("./sandra/src/CSCannon/Kusama/KusamaBlockchain.js");
const RmrkContractStandard_js_1 = require("./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js");
const CSCanonizeManager_js_1 = require("./sandra/src/CSCannon/CSCanonizeManager.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager();
let sandra = canonizeManager.getSandra();
let kusama = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
let myCollection = canonizeManager.createCollection({ id: 'my veryfirst collection', imageUrl: 'https://picsum.photos/400', name: 'my veryfirst collection', description: 'dolor' });
let myAsset = canonizeManager.createAsset({ assetId: 'A great asset I made', imageUrl: "https://picsum.photos/400", description: 'hello' });
let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');
myAsset.bindCollection(myCollection);
myCOntract.bindToCollection(myCollection);
myAsset.bindContract(myCOntract);
let rmrkToken = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager);
rmrkToken.setSn("0000000000000003");
let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);
tokenPath.bindToAssetWithContract(myCOntract, myAsset);
//console.log(myAsset.subjectConcept.triplets);
//console.log(canonizeManager.getSandra());
console.log(myAsset.getJoinedContracts());
console.log("event");
// let gossiper = new Gossiper(kusama.eventFactory,sandra.get('txId'));
// let result = gossiper.exposeGossip();
//
// let json = JSON.stringify(result);
// console.log(json);
// const xmlhttp = new XMLHttpRequest();
// xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
// xmlhttp.setRequestHeader("Content-Type", "application/json");
// xmlhttp.send(json);
// xmlhttp.addEventListener("load", ()=>{
//     console.log("complete");
// });
//# sourceMappingURL=sandraTest.js.map