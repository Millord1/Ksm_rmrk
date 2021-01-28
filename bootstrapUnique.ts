import {SandraManager} from "./sandra/src/SandraManager";
import {Kusama} from "./classes/Blockchains/Kusama";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {Gossiper} from "./sandra/src/Gossiper.js";
import {AssetCollection} from "./sandra/src/CSCannon/AssetCollection.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {AssetFactory} from "./sandra/src/CSCannon/AssetFactory.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {BlockchainTokenFactory} from "./sandra/src/CSCannon/BlockchainTokenFactory.js";
import {UniqueBlockchain} from "./sandra/src/CSCannon/Substrate/Unique/UniqueBlockchain.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//enter a jwt granting access to crystal suite
let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8';

//initialisation
let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
let sandra = canonizeManager.getSandra();


let unique = new UniqueBlockchain(sandra);

// this will erase all data in your datagraph environment (specified in the jwt) note some jwt allow or disallow flush
canonizeManager.flushWithBlockchainSupport([unique]).then(r=>{

    console.log("flushed and added blockchain support");
    console.log(r);

}).catch(

    err=>{console.log(err)}
    )







let myCollection = canonizeManager.createCollection({id:'my veryfirst collection',imageUrl:'https://picsum.photos/400',name:'my veryfirst collection',description:'dolor'});

let myAsset = canonizeManager.createAsset({assetId:'A great asset I made',imageUrl:"https://picsum.photos/400",description:'hello'});
let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL');

myAsset.bindCollection(myCollection);
myCOntract.bindToCollection(myCollection);

let rmrkToken = new RmrkContractStandard(canonizeManager);
rmrkToken.setSn("0000000000000003");
let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);


tokenPath.bindToAssetWithContract(myCOntract,myAsset);

console.log(myAsset.getRefValue('assetId'));

myAsset.setImageUrl('myNew');



console.log(myAsset.getImageUrl());


let myAsset1 = canonizeManager.createAsset({assetId:'a1',imageUrl:"https://picsum.photos/400",description:'hello'});
let myAsset2 = canonizeManager.createAsset({assetId:'a2',imageUrl:"https://picsum.photos/400",description:'hello'});
let myAsset3 = canonizeManager.createAsset({assetId:'a3',imageUrl:"https://picsum.photos/400",description:'hello'});

let found = canonizeManager.getAssetFactory().getEntitiesWithRefValue('description','hello');

if (found){

    console.log("XXXXXXXXXXXXXXX")
    console.log("found")
    console.log("XXXXXXXXXXXXXXX")
    console.log(found);

}
