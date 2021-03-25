// import {SandraManager} from "./sandra/src/SandraManager";
// import {Kusama} from "./classes/Blockchains/Kusama";
import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";
import {BlockchainEvent} from "canonizer/src/canonizer/BlockchainEvent";
// import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
// import {Gossiper} from "./sandra/src/Gossiper.js";
// import {AssetCollection} from "./sandra/src/CSCannon/AssetCollection.js";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
// import {AssetFactory} from "./sandra/src/CSCannon/AssetFactory.js";
import {RmrkContractStandard} from "canonizer/src/canonizer/Interfaces/RmrkContractStandard";
// import {BlockchainTokenFactory} from "./sandra/src/CSCannon/BlockchainTokenFactory.js";
// import {WestendBlockchain} from "canonizer/src/canonizer/Kusama/WestendBlockchain";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8';

//let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});

let sandra = canonizeManager.getSandra();
let kusama = new KusamaBlockchain(sandra);
// let westend = new WestendBlockchain(sandra);

bootstrap();


async function bootstrap(){


    const flush = await flushDatagraph() // add remove this to erase the full database
    const createTestCollection = await bootstrapCollection();
    const createTestEvent = await bootstrapEvents();

}



async function bootstrapCollection () {
    console.log("Creating Collection")

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

    let rmrkContractStandard = new RmrkContractStandard(canonizeManager);
    let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL').setStandard(rmrkContractStandard);


    myAsset.bindCollection(myCollection);
    myCOntract.bindToCollection(myCollection);
    myAsset.bindContract(myCOntract);

    //now that we build all relation between token and asset we are ready to publish it to the server
    let response = await canonizeManager.gossipOrbsBindings();
    console.log(JSON.parse(response));

}

async function bootstrapEvents (){
    console.log("Creating Events")

    let rmrkToken = new RmrkContractStandard(canonizeManager);
    let myCOntract = kusama.contractFactory.getOrCreate('241B8516516F381A-FRACTAL')
    rmrkToken.setSn("0000000000000003");
    rmrkToken.generateTokenPathEntity(canonizeManager);
    let event = new BlockchainEvent(kusama.eventFactory,
        'address1',
        'addressDest1', myCOntract,
        'txid1111',
        '1111111',
        "1",
        kusama,
        3,
        rmrkToken,
        canonizeManager.getSandra());

    let response = await canonizeManager.gossipBlockchainEvents(kusama);

    console.log(JSON.parse(response));

}


async function flushDatagraph (){

    let flushing = await canonizeManager.flushWithBlockchainSupport([kusama]).then(r=>{
        console.log("flushed and added blockchain support");
        console.log(JSON.parse(r));
        return r ;


    }).catch(

        err=>{console.log(err)}
    )
}




