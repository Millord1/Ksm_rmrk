"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanOneBlock = exports.forceScan = exports.testScan = exports.getJwt = void 0;
const Polkadot_js_1 = require("./classes/Blockchains/Polkadot.js");
const Unique_js_1 = require("./classes/Blockchains/Unique.js");
const Kusama_js_1 = require("./classes/Blockchains/Kusama.js");
const RmrkJetski_js_1 = require("./Kusama/RmrkJetski.js");
const KusamaBlockchain_js_1 = require("./sandra/src/CSCannon/Substrate/Kusama/KusamaBlockchain.js");
const BlockchainAddress_js_1 = require("./sandra/src/CSCannon/BlockchainAddress.js");
const BlockchainContract_js_1 = require("./sandra/src/CSCannon/BlockchainContract.js");
const BlockchainEvent_js_1 = require("./sandra/src/CSCannon/BlockchainEvent.js");
const RmrkContractStandard_js_1 = require("./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js");
const CSCanonizeManager_js_1 = require("./sandra/src/CSCannon/CSCanonizeManager.js");
const Mint_js_1 = require("./classes/Rmrk/Interactions/Mint.js");
const MintNft_js_1 = require("./classes/Rmrk/Interactions/MintNft.js");
const Send_js_1 = require("./classes/Rmrk/Interactions/Send.js");
const Collection_js_1 = require("./classes/Collection.js");
const Asset_js_1 = require("./classes/Asset.js");
const assert_1 = require("assert");
const ts_dotenv_1 = require("ts-dotenv");
const WestEnd_1 = require("./classes/Blockchains/WestEnd");
// 1er dec 5144100
// 1er fevrier 6024550
// Last block scanned 6715824
// Buy 6546060
const getJwt = () => {
    const env = ts_dotenv_1.load({
        JWT: String
    });
    assert_1.strict.ok(env.JWT != "jwt_code");
    assert_1.strict.ok(env.JWT != "");
    assert_1.strict.ok(env.JWT != null);
    assert_1.strict.ok(env.JWT != undefined);
    return env.JWT;
};
exports.getJwt = getJwt;
function launchJetskiLoop(scan, api, currentBlock, blockN) {
    // Assign setInterval return to a var so we can interrupt it later
    let interval = setInterval(async () => {
        // Checks if API is disconnected, break loop, wait for a reconnect, relaunch loop
        if (!api.isConnected) {
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');
            api = await scan.getApi();
            console.log('API reconnected, loop will now restart');
            launchJetskiLoop(scan, api, --currentBlock, blockN);
        }
        else {
            if (currentBlock != blockN) {
                currentBlock = blockN;
                scan.getRmrks(blockN, api)
                    .then(result => {
                    if (result.length > 0) {
                        result.forEach(async (value) => {
                            if (typeof value === 'object') {
                                console.log(value);
                                dispatchForCanonizer(value);
                            }
                        });
                    }
                    blockN++;
                })
                    .catch(async (e) => {
                    console.error(e);
                    console.log('Waiting for block ...');
                    setTimeout(() => {
                        currentBlock--;
                    }, 10000);
                });
            }
        }
    }, 1000 / 50);
}
const testScan = async (opts) => {
    let blockchain;
    //@ts-ignore
    switch (opts.chain.toLowerCase()) {
        case "polkadot":
            blockchain = new Polkadot_js_1.Polkadot();
            break;
        case "unique":
            // TODO remake Unique Blockchain
            // @ts-ignore
            blockchain = new Unique_js_1.Unique();
            break;
        case 'westend':
            blockchain = new WestEnd_1.WestEnd();
            break;
        case "kusama":
        default:
            blockchain = new Kusama_js_1.Kusama();
            break;
    }
    console.log("scanning blockchain");
    console.log(blockchain.constructor.name);
    //@ts-ignore
    let blockN = opts.block;
    let api;
    const scan = new RmrkJetski_js_1.RmrkJetski(blockchain);
    api = await scan.getApi();
    let currentBlock = 0;
    // Launches the jetski loop
    launchJetskiLoop(scan, api, currentBlock, blockN);
};
exports.testScan = testScan;
const forceScan = async (block) => {
    let blockchain;
    blockchain = new Kusama_js_1.Kusama();
    const scan = new RmrkJetski_js_1.RmrkJetski(blockchain);
    const api = await scan.getApi();
    scan.getRmrks(block, api).then(result => {
        result.forEach(value => {
            if (typeof value === 'object') {
                // dispatchForCanonizer(value);
                console.log(value);
            }
        });
    });
};
exports.forceScan = forceScan;
const scanOneBlock = async (opts) => {
    let chain;
    //@ts-ignore
    switch (opts.chain.toLowerCase()) {
        case "polkadot":
            chain = new Polkadot_js_1.Polkadot();
            break;
        case "unique":
            // TODO remake Unique Blockchain
            // @ts-ignore
            chain = new Unique_js_1.Unique();
            break;
        case 'westend':
            chain = new WestEnd_1.WestEnd();
            break;
        case "kusama":
        default:
            chain = new Kusama_js_1.Kusama();
            break;
    }
    console.log(chain.constructor.name);
    // @ts-ignore
    const blockN = opts.block;
    // const chain = new Kusama();
    const jetski = new RmrkJetski_js_1.RmrkJetski(chain);
    const api = await jetski.getApi();
    jetski.getRmrks(blockN, api).then(result => {
        result.forEach((rmrk) => {
            if (typeof rmrk === "object") {
                // dispatchForCanonizer(rmrk);
                console.log(rmrk);
            }
        });
    });
};
exports.scanOneBlock = scanOneBlock;
const dispatchForCanonizer = async (value) => {
    let collName = "";
    let sn = "";
    // TODO Reactivate for Buy
    // if(value instanceof Send || value instanceof Buy){
    if (value instanceof Send_js_1.Send) {
        collName = value.nft.assetId;
        sn = value.nft.token.sn;
        if (sn != "" && collName != "") {
            await eventGossip(value, sn, collName);
        }
    }
    else if (value instanceof MintNft_js_1.MintNft) {
        collName = value.nft.assetId;
        sn = value.nft.token.sn;
        const source = value.transaction.source;
        value.transaction.source = CSCanonizeManager_js_1.CSCanonizeManager.mintIssuerAddressString;
        value.transaction.destination.address = source;
        if (sn != "" && collName != "") {
            entityGossip(value.nft).then(async () => { await eventGossip(value, sn, collName); });
        }
    }
    else if (value instanceof Mint_js_1.Mint) {
        await entityGossip(value.collection);
    }
};
const eventGossip = async (value, sn, collName) => {
    const signer = value.transaction.source;
    const recipient = value.transaction.destination.address;
    // TODO Activate For Buy
    // if (value instanceof Buy){
    //     recipient = value.transaction.transferDestination ? value.transaction.transferDestination : value.transaction.destination.address
    // }
    const jwt = exports.getJwt();
    let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
    let sandra = canonizeManager.getSandra();
    let blockchain = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
    let address = new BlockchainAddress_js_1.BlockchainAddress(blockchain.addressFactory, signer, sandra);
    let receiver = new BlockchainAddress_js_1.BlockchainAddress(blockchain.addressFactory, recipient, sandra);
    let contract = new BlockchainContract_js_1.BlockchainContract(blockchain.contractFactory, collName, sandra, new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager));
    const txId = value.transaction.txHash;
    const timestamp = value.transaction.timestamp;
    const blockId = value.transaction.blockId;
    const contractStandard = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager, sn);
    let event = new BlockchainEvent_js_1.BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, timestamp, '1', blockchain, blockId, contractStandard, sandra);
    canonizeManager.gossipBlockchainEvents(blockchain).then(r => { console.log("event gossiped " + blockId); });
};
const entityGossip = async (rmrk) => {
    const jwt = exports.getJwt();
    let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager({ connector: { gossipUrl: 'http://arkam.everdreamsoft.com/alex/gossip', jwt: jwt } });
    let sandra = canonizeManager.getSandra();
    let kusama = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
    let collectionId = "";
    let image = "";
    let description = "";
    const blockId = rmrk.transaction.blockId;
    if (rmrk.metaDataContent != null) {
        const meta = rmrk.metaDataContent;
        if (meta.description != 'undefined') {
            description = meta.description;
        }
        else {
            description = "No description";
        }
        if (meta.image != undefined) {
            image = meta.image.replace("ipfs://", 'https://cloudflare-ipfs.com/');
        }
    }
    if (rmrk instanceof Asset_js_1.Asset) {
        collectionId = rmrk.token.contractId;
        let myContract = kusama.contractFactory.getOrCreate(rmrk.assetId);
        let myAsset = canonizeManager.createAsset({ assetId: rmrk.assetId, imageUrl: image, description: description, name: rmrk.name });
        let myCollection = canonizeManager.createCollection({ id: collectionId });
        myAsset.bindCollection(myCollection);
        myContract.bindToCollection(myCollection);
        let rmrkToken = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager);
        myContract.setStandard(rmrkToken);
        myAsset.bindContract(myContract);
        canonizeManager.gossipOrbsBindings().then(r => { console.log("asset gossiped " + blockId); });
    }
    else if (rmrk instanceof Collection_js_1.Collection) {
        collectionId = rmrk.contract.id;
        let myContract = kusama.contractFactory.getOrCreate(collectionId);
        let myCollection = canonizeManager.createCollection({ id: collectionId, imageUrl: image, name: rmrk.contract.collection, description: description });
        myContract.bindToCollection(myCollection);
        canonizeManager.gossipCollection().then(r => { console.log("collection gossiped " + blockId + r); });
    }
};
//# sourceMappingURL=StartScan.js.map