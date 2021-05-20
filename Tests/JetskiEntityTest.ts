import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";
import {BlockchainBlock} from "canonizer/src/canonizer/BlockchainBlock";
import {CanonizerJetski} from "canonizer/src/canonizer/tools/jetski/CanonizerJetski";

const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8";

const canonize = new CSCanonizeManager({connector: {gossipUrl: "http://arkam.everdreamsoft.com/alex/gossip", jwt: jwt} });
const sandra = canonize.getSandra();

const blockchain = new KusamaBlockchain(sandra);

const instance = 123456;
const block = 654321;


const jetskiManager = new CanonizerJetski(canonize, instance.toString());
const blockObj = new BlockchainBlock(blockchain.blockFactory, block, instance.toString(), sandra);

const jetskiFactory = jetskiManager.getJetskifacory();

const jetskiEntity = jetskiFactory.getOrCreateJetskiInstance(blockchain.getName(), blockObj, instance.toString(), sandra);
jetskiEntity.setLatestBlock(blockObj);

jetskiManager.gossipLatestBlock()
    .then(r=>{
        console.log(r);
    }).catch(e=>{
    console.log(e);
});
