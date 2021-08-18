"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KusamaBlockchain_1 = require("canonizer/src/canonizer/Kusama/KusamaBlockchain");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const GossiperFactory_1 = require("../src/Gossiper/GossiperFactory");
const InstanceGossiper_1 = require("../src/Gossiper/InstanceGossiper");
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbnYiOiJnb3NzaXAiLCJmbHVzaCI6dHJ1ZSwiZXhwIjoxMDQ0NDE5MjUyMDQwMDAwfQ.i3MRmP56AEvIvWGdnj1TKuLZNaqLYaqzXaWijtT-Cc8";
// const chain = "kusama";
// const jwt = GossiperFactory.getJwt(chain.toLowerCase());
const canonize = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: jwt } });
const sandra = canonize.getSandra();
const blockchain = new KusamaBlockchain_1.KusamaBlockchain(sandra);
const instance = 123456;
const block = 7471596;
const instanceGossiper = new InstanceGossiper_1.InstanceGossiper(blockchain, canonize);
instanceGossiper.sendLastBlock(block, instance);
//# sourceMappingURL=JetskiEntityTest.js.map