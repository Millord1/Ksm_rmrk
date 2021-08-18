"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {SandraManager} from "./sandra/src/SandraManager";
// import {Kusama} from "./classes/Blockchains/Kusama";
const KusamaBlockchain_1 = require("canonizer/src/canonizer/Kusama/KusamaBlockchain");
const BlockchainEvent_1 = require("canonizer/src/canonizer/BlockchainEvent");
// import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
// import {Gossiper} from "./sandra/src/Gossiper.js";
// import {AssetCollection} from "./sandra/src/CSCannon/AssetCollection.js";
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
// import {AssetFactory} from "./sandra/src/CSCannon/AssetFactory.js";
const RmrkContractStandard_1 = require("canonizer/src/canonizer/Interfaces/RmrkContractStandard");
// import {BlockchainTokenFactory} from "./sandra/src/CSCannon/BlockchainTokenFactory.js";
const WestendBlockchain_1 = require("canonizer/src/canonizer/Substrate/Westend/WestendBlockchain");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// Gossip
let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8';
// Oedo
// let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJvZWRvIiwiZmx1c2giOnRydWUsImV4cCI6MTA0ODA3MjU1MTYyNDAwMH0.Plod9xQFnkonkUAZk88n63ykpj56u6vWS-5pwiWznXw';
// WestEnd
// let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJzaGlidXlhIiwiZmx1c2giOmZhbHNlLCJleHAiOjEwNDc0NDY1NzcxNDQwMDB9.VNMArL_m04pSxuOqaNbwGc38z-bfQnHntGJHa2FgAXQ';
// let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:GossiperFactory.gossipUrl,jwt:jwt}});
let canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
let sandra = canonizeManager.getSandra();
let kusama = new KusamaBlockchain_1.KusamaBlockchain(sandra);
let westend = new WestendBlockchain_1.WestendBlockchain(sandra);
bootstrap();
async function bootstrap() {
    const flush = await flushDatagraph(); // add remove this to erase the full database
    // const createTestCollection = await bootstrapCollection();
    // const createTestEvent = await bootstrapEvents();
}
async function bootstrapCollection() {
    console.log("Creating Collection");
    let myCollection = canonizeManager.createCollection({
        id: 'myCollection',
        imageUrl: 'https://picsum.photos/400',
        name: 'my veryfirst collection',
        description: 'dolor'
    });
    let myAsset = canonizeManager.createAsset({
        assetId: 'MyGreatAsset',
        imageUrl: "https://picsum.photos/400",
        description: 'hello'
    });
    let rmrkContractStandard = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
    let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL').setStandard(rmrkContractStandard);
    myAsset.bindCollection(myCollection);
    myCOntract.bindToCollection(myCollection);
    myAsset.bindContract(myCOntract);
    //now that we build all relation between token and asset we are ready to publish it to the server
    let response = await canonizeManager.gossipOrbsBindings();
    console.log(JSON.parse(response));
}
async function bootstrapEvents() {
    console.log("Creating Events");
    let rmrkToken = new RmrkContractStandard_1.RmrkContractStandard(canonizeManager);
    let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');
    rmrkToken.setSn("0000000000000003");
    rmrkToken.generateTokenPathEntity(canonizeManager);
    let event = new BlockchainEvent_1.BlockchainEvent(kusama.eventFactory, 'address1', 'addressDest1', myCOntract, 'txid1111', '1111111', "1", kusama, 3, rmrkToken, canonizeManager.getSandra());
    let response = await canonizeManager.gossipBlockchainEvents(kusama);
    console.log(JSON.parse(response));
}
async function flushDatagraph() {
    let flushing = await canonizeManager.flushWithBlockchainSupport([kusama, westend]).then(r => {
        console.log("flushed and added blockchain support");
        console.log(JSON.parse(r));
        return r;
    }).catch(err => { console.log(err); });
}
//# sourceMappingURL=bootstrapRmrk.js.map