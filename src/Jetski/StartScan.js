"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.scan = exports.eggs = exports.startJetskiLoop = exports.startScanner = void 0;
const Kusama_1 = require("../Blockchains/Kusama");
const Jetski_1 = require("./Jetski");
const GossiperFactory_1 = require("../Gossiper/GossiperFactory");
const MetaData_1 = require("../Remark/MetaData");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const Mint_1 = require("../Remark/Interactions/Mint");
const Collection_1 = require("../Remark/Entities/Collection");
const Asset_1 = require("../Remark/Entities/Asset");
const WestEnd_1 = require("../Blockchains/WestEnd");
const Polkadot_1 = require("../Blockchains/Polkadot");
const FileManager_1 = require("../Files/FileManager");
const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
// TODO JWT depend of blockchain
// TODO one thread by blockchain ?
// Verify : 6312038
// 6827717
// WE Start 4887870
// WE last 4990872
// eggs 6802454 6802508 6802545
function getBlockchain(chainName) {
    switch (chainName.toLowerCase()) {
        case "westend":
            return new WestEnd_1.WestEnd();
        case "polkadot":
            return new Polkadot_1.Polkadot();
        case "kusama":
        default:
            return new Kusama_1.Kusama();
    }
}
function needRescan(remarks) {
    let entity;
    remarks.forEach((rmrk) => {
        if (rmrk instanceof Mint_1.Mint && rmrk.collection) {
            entity = rmrk.collection;
        }
        else if (rmrk instanceof MintNft_1.MintNft && rmrk.asset) {
            entity = rmrk.asset;
        }
        if (entity && !entity.metaData) {
            return true;
        }
    });
    return false;
}
const startScanner = async (opts) => {
    // Launch jetski from yarn
    // @ts-ignore
    const chainName = opts.chain;
    let chain = getBlockchain(chainName);
    console.log(chain.constructor.name);
    // @ts-ignore
    let blockNumber = opts.block;
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    let currentBlock = 0;
    let lastSave = 0;
    if (blockNumber == 0) {
        blockNumber = FileManager_1.FileManager.getLastBlock(chainName);
        if (!blockNumber) {
            console.error('Incorrect block number, please try with the --block={blockNumber} option');
            process.exit();
        }
    }
    const id = Date.now() * 1000;
    if (!FileManager_1.FileManager.checkLock(chainName, id)) {
        // check if lock file exists
        startJetskiLoop(jetski, api, currentBlock, blockNumber, lastSave, chainName, id);
    }
    else {
        readline.question("Thread is actually locked, did you want to unlock ? (Y/n) ", (answer) => {
            answer = answer.toLowerCase();
            if (answer == "y" || answer == "yes") {
                try {
                    fs.unlinkSync(path.resolve(FileManager_1.FileManager.getThreadLockPath(chainName)));
                }
                catch (e) {
                    console.error(e);
                    console.log("Something is wrong, please delete manually Files/thread.lock.json");
                }
                startJetskiLoop(jetski, api, currentBlock, blockNumber, lastSave, chainName, id);
            }
            else {
                process.exit();
            }
        });
    }
};
exports.startScanner = startScanner;
function startJetskiLoop(jetski, api, currentBlock, blockNumber, lastBlockSaved, chain, id) {
    // generate file for lock one thread
    FileManager_1.FileManager.startLock(blockNumber, chain, id);
    // Array of block without meta for rescan
    let toRescan = [];
    let lockExists = true;
    // launch the loop on blocks
    let interval = setInterval(async () => {
        process.on('exit', () => {
            // Save last block when app is closing
            FileManager_1.FileManager.exitProcess(blockNumber, chain, toRescan);
        });
        process.on('SIGINT', () => {
            // Save last block on exit Ctrl+C
            FileManager_1.FileManager.exitProcess(blockNumber, chain, toRescan);
        });
        if (!api.isConnected) {
            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');
            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');
            startJetskiLoop(jetski, api, --currentBlock, blockNumber, lastBlockSaved, chain, id);
        }
        else {
            if (currentBlock != blockNumber) {
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;
                if (lastBlockSaved == 0 || blockNumber - lastBlockSaved > 99) {
                    // Save block number each 100 blocks
                    if (FileManager_1.FileManager.saveLastBlock(blockNumber, chain)) {
                        lastBlockSaved = blockNumber;
                        // check if lock file already exists
                        lockExists = FileManager_1.FileManager.checkLock(chain, id);
                    }
                    else {
                        console.error("Fail to save block");
                    }
                }
                if (lockExists) {
                    // if file lock exists, continue scan
                    jetski.getBlockContent(blockNumber, api)
                        .then(async (remarks) => {
                        // Check if metadata exists
                        const rmrksWithMeta = await metaDataVerifier(remarks);
                        if (needRescan(rmrksWithMeta)) {
                            toRescan.push(blockNumber);
                        }
                        const needDelay = rmrksWithMeta.length > 5;
                        if (rmrksWithMeta.length > 0) {
                            // Gossip if array not empty
                            for (const rmrk of rmrksWithMeta) {
                                const gossip = new GossiperFactory_1.GossiperFactory(rmrk);
                                const gossiper = await gossip.getGossiper();
                                gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
                                // if array have many rmrks, delay between calls
                                if (needDelay) {
                                    setTimeout(() => {
                                        console.log("Wait for next gossip ...");
                                    }, 500);
                                }
                            }
                        }
                        blockNumber++;
                    }).catch(e => {
                        console.error(e);
                        if (e == Jetski_1.Jetski.noBlock) {
                            // If block doesn't exists, wait and try again
                            console.log('Waiting for block ...');
                            setTimeout(() => {
                                currentBlock--;
                            }, 5000);
                        }
                        else {
                            // If Entity doesn't exists in Interaction
                            // Probably because of non respect of version standards or special chars
                            blockNumber++;
                        }
                    });
                }
                else {
                    // else stop the scan
                    console.error("Lock file is apparently deleted, run will stop");
                    FileManager_1.FileManager.exitProcess(blockNumber, chain, toRescan);
                }
            }
        }
    }, 1000 / 50);
}
exports.startJetskiLoop = startJetskiLoop;
async function eggs(opts) {
    // @ts-ignore
    const block = opts.block;
    const chain = new Kusama_1.Kusama();
    // @ts-ignore
    const count = opts.count;
    const jetski = new Jetski_1.Jetski(chain);
    const api = await jetski.getApi();
    jetski.getBigBlock(block, api, count)
        .then(async (result) => {
        const rmrks = await metaDataVerifier(result);
        for (const rmrk of rmrks) {
            const gossip = new GossiperFactory_1.GossiperFactory(rmrk);
            const gossiper = await gossip.getGossiper();
            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
            setTimeout(() => {
                console.log('Wait ...');
            }, 500);
        }
    }).catch((e) => {
        console.error(e);
    });
}
exports.eggs = eggs;
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
        const needDelay = rmrks.length > 5;
        for (const rmrk of rmrks) {
            console.log(rmrk);
            const gossip = new GossiperFactory_1.GossiperFactory(rmrk);
            const gossiper = await gossip.getGossiper();
            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
            if (needDelay) {
                setTimeout(() => {
                    console.log('Wait ...');
                }, 500);
            }
        }
    });
};
exports.scan = scan;
async function metaDataVerifier(remarks) {
    return new Promise(async (resolve) => {
        let entity;
        for (const rmrk of remarks) {
            // loop for checking if meta exists
            if (rmrk instanceof Mint_1.Mint) {
                if (rmrk.collection instanceof Collection_1.Collection && !rmrk.collection.metaData) {
                    entity = rmrk.collection;
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