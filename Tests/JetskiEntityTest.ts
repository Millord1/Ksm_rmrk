import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {GossiperFactory} from "../src/Gossiper/GossiperFactory";
import {InstanceGossiper} from "../src/Gossiper/InstanceGossiper";
import {Kusama} from "../src/Blockchains/Kusama";


const kusama = new Kusama();
const jwt = GossiperFactory.getJwt(kusama.constructor.name.toLowerCase());
console.log(jwt);
process.exit();


// const chain = "kusama";
// const jwt = GossiperFactory.getJwt(chain.toLowerCase());
// const canonize = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl, jwt: jwt} });
// const sandra = canonize.getSandra();
//
// const blockchain = new KusamaBlockchain(sandra);
//
// const instance = 123456;
// const block = 654321;
//
// const instanceGossiper = new InstanceGossiper(blockchain, canonize);
// instanceGossiper.sendLastBlock(block, instance);
