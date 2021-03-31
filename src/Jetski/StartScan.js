"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.scan = exports.startScanner = void 0;
const Kusama_1 = require("../Blockchains/Kusama");
const Jetski_1 = require("./Jetski");
const GossiperFactory_1 = require("../Gossiper/GossiperFactory");
const MetaData_1 = require("../Remark/MetaData");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const Mint_1 = require("../Remark/Interactions/Mint");
const Collection_1 = require("../Remark/Entities/Collection");
const Entity_1 = require("../Remark/Entities/Entity");
const Asset_1 = require("../Remark/Entities/Asset");
const WestEnd_1 = require("../Blockchains/WestEnd");
// Verify : 6312038
// 6334378
function getBlockchain(chainName) {
    switch (chainName.toLowerCase()) {
        case "westend":
            return new WestEnd_1.WestEnd();
        case "kusama":
        default:
            return new Kusama_1.Kusama();
    }
}
const startScanner = async (opts) => {
    // Launch jetski from yarn
    // @ts-ignore
    let chain = getBlockchain(opts.chain);
    // @ts-ignore
    let blockNumber = opts.block;
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    let currentBlock = 0;
    startJetskiLoop(jetski, api, currentBlock, blockNumber);
};
exports.startScanner = startScanner;
function startJetskiLoop(jetski, api, currentBlock, blockNumber) {
    // launch the loop on blocks
    let interval = setInterval(async () => {
        if (!api.isConnected) {
            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');
            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');
            startJetskiLoop(jetski, api, --currentBlock, blockNumber);
        }
        else {
            if (currentBlock != blockNumber) {
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;
                jetski.getBlockContent(blockNumber, api)
                    .then(async (remarks) => {
                    // Check if metadata exists
                    const rmrksWithMeta = await metaDataVerifier(remarks);
                    if (rmrksWithMeta.length > 0) {
                        // Gossip if array not empty
                        for (const rmrk of rmrksWithMeta) {
                            const gossip = new GossiperFactory_1.GossiperFactory(rmrk);
                            const gossiper = await gossip.getGossiper();
                            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
                        }
                    }
                    blockNumber++;
                }).catch(e => {
                    if (e == Jetski_1.Jetski.noBlock) {
                        // If block doesn't exists, wait and try again
                        console.error(e);
                        console.log('Waiting for block ...');
                        setTimeout(() => {
                            currentBlock--;
                        }, 5000);
                    }
                    else if (e == Entity_1.Entity.undefinedEntity) {
                        // If Entity doesn't exists in Interaction
                        // Probably because of non respect of version standards
                        blockNumber++;
                    }
                });
            }
        }
    }, 1000 / 50);
}
const scan = async (opts) => {
    // scan only one block
    // @ts-ignore
    let chain = getBlockchain(opts.chain);
    const jetski = new Jetski_1.Jetski(chain);
    const api = await jetski.getApi();
    // @ts-ignore
    const blockN = opts.block;
    jetski.getBlockContent(blockN, api).then(async (result) => {
        const rmrks = await metaDataVerifier(result);
        for (const rmrk of rmrks) {
            console.log(rmrk);
            const gossip = new GossiperFactory_1.GossiperFactory(rmrk);
            const gossiper = await gossip.getGossiper();
            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
        }
    });
};
exports.scan = scan;
async function metaDataVerifier(remarks) {
    return new Promise(async (resolve) => {
        for (const rmrk of remarks) {
            // loop for checking if meta exists
            if (rmrk instanceof Mint_1.Mint) {
                if (rmrk.collection instanceof Collection_1.Collection && !rmrk.collection.metaData) {
                    // if meta doesn't exists, call
                    metaDataCaller(rmrk.collection)
                        .then((meta) => {
                        // @ts-ignore rmrk.collection is instance of Collection
                        rmrk.collection.metaData = meta;
                    }).catch(e => {
                        console.error(e);
                    });
                }
            }
            else if (rmrk instanceof MintNft_1.MintNft) {
                if (rmrk.asset instanceof Asset_1.Asset && !rmrk.asset.metaData) {
                    // if meta doesn't exists, call
                    metaDataCaller(rmrk.asset)
                        .then((meta) => {
                        // @ts-ignore rmrk.asset is instance of Asset
                        rmrk.asset.metaData = meta;
                    }).catch((e) => {
                        console.error(e);
                    });
                }
            }
        }
        resolve(remarks);
    });
}
async function metaDataCaller(entity, nbOfTry = 0) {
    return new Promise((resolve, reject) => {
        if (entity.url) {
            // verify url existst
            MetaData_1.MetaData.getMetaData(entity.url)
                .then(metaData => {
                resolve(metaData);
            }).catch(e => {
                if (nbOfTry < 2) {
                    // try a second call meta if the first fail
                    setTimeout(() => {
                        metaDataCaller(entity, nbOfTry++);
                    }, 500);
                }
                else {
                    // if 2 calls meta are failed, reject
                    reject(e);
                }
            });
        }
    });
}
const test = () => {
    console.log("Hello World");
};
exports.test = test;
//# sourceMappingURL=StartScan.js.map