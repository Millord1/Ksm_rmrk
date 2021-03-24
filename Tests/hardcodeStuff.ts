import {CSCanonizeManager} from "../sandra/src/CSCannon/CSCanonizeManager.js";
import {getJwt} from "../StartScan.js";
import {KusamaAddress} from "../classes/Addresses/KusamaAddress.js";
import {WestendBlockchain} from "../sandra/src/CSCannon/Substrate/Westend/WestendBlockchain.js";

 const jwt = getJwt();


let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});
let westend = new WestendBlockchain(canonizeManager.getSandra());

let myCollection = canonizeManager.createCollection({
    id: '26d6484336c010812d-CANON',
    imageUrl: 'https://cloudflare-ipfs.com/ipfs/QmbgUBE7cgSCytnVAsXNVXrrVrn2QnTbhmzhqUqnVQHBGN',
    name: 'Canonizer RMRK NFTsX',
    description: 'This is the first Canonizer RMRK NFT collection on Westend'
});

myCollection.setOwner(westend.addressFactory.getOrCreate('5CwdLCoW7N3Lhnx1axryueg2SdoSJoKTvUorvNuiBPXfEpGQ'));




canonizeManager.gossipCollection();