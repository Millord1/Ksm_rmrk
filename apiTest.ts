import {CsCannonApiManager} from "./sandra/src/CSCannon/CsCannonApiManager";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager";

let canonizeManager = new CSCanonizeManager();

let api = new CsCannonApiManager(canonizeManager,'https://gossip.everdreamsoft.com/')

api.getCollections().then(collections=>{

    collections.forEach(collection =>{

        collection.getName();
        console.log(collection)

})});