import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {GossiperFactory} from "../src/Gossiper/GossiperFactory";
import {InstanceGossiper} from "../src/Gossiper/InstanceGossiper";
import {Kusama} from "../src/Blockchains/Kusama";


const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8"



// const chain = "kusama";
// const jwt = GossiperFactory.getJwt(chain.toLowerCase());
const canonize = new CSCanonizeManager({connector: {gossipUrl: GossiperFactory.gossipUrl, jwt: jwt} });
const sandra = canonize.getSandra();

const blockchain = new KusamaBlockchain(sandra);

const instance = 123456;
const block = 7471596;

const instanceGossiper = new InstanceGossiper(blockchain, canonize);
instanceGossiper.sendLastBlock(block, instance);
