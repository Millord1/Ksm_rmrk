"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CsCannonApiManager_1 = require("./sandra/src/CSCannon/CsCannonApiManager");
const CSCanonizeManager_1 = require("./sandra/src/CSCannon/CSCanonizeManager");
let canonizeManager = new CSCanonizeManager_1.CSCanonizeManager();
let api = new CsCannonApiManager_1.CsCannonApiManager(canonizeManager, 'https://gossip.everdreamsoft.com/');
api.getCollections().then(collections => {
    collections.forEach(collection => {
        collection.getName();
        console.log(collection);
    });
});
//# sourceMappingURL=apiTest.js.map