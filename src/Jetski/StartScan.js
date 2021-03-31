"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.scan = exports.startJetskiLoop = exports.startScanner = void 0;
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
const globals_1 = require("../globals");
const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const threadLock = "src/Files/thread.lock.json";
const save = "_lastBlock.json";
// Verify : 6312038
// 6827717
// WE Start 4887870
// WE last 4990872
// TODO TEST read in folder
// TODO write file server on node
// TODO save block without meta in Global array for writing on exit
// TODO check if .lock already exists for continue scan
function startLock(startBlock, chain) {
    // create file for lock one thread
    const dateTimestamp = Date.now() * 1000;
    const date = new Date(dateTimestamp);
    const threadData = {
        startBlock: startBlock,
        chain: chain,
        start: date
    };
    const data = JSON.stringify(threadData);
    try {
        fs.writeFileSync(path.resolve(threadLock), data);
    }
    catch (e) {
        console.error(e);
    }
}
function checkLock() {
    return fs.existsSync(path.resolve(threadLock));
}
function getLastBlock(chain) {
    // read file for get last block
    if (fs.existsSync(path.resolve("src/Files/" + chain + save))) {
        const lastBlock = fs.readFileSync(path.resolve("src/Files/" + chain + save));
        const data = JSON.parse(lastBlock);
        return data.lastBlock;
    }
    return undefined;
}
function exitProcess(blockNumber, chain) {
    // save block and exit process
    console.log('exit process ...');
    blockNumber--;
    if (saveLastBlock(blockNumber, chain)) {
        console.log('saved block : ' + blockNumber);
    }
    else {
        console.log('Fail to save block : ' + blockNumber);
    }
    const blocksToRescan = JSON.stringify(globals_1.Global.blocksToRescan);
    if (globals_1.Global.blocksToRescan) {
        try {
            fs.writeFileSync(path.resolve("Files/toRescan.json"), blocksToRescan);
            console.log("Rescan saved");
        }
        catch (e) {
            console.error(e);
        }
    }
    process.exit();
}
function saveLastBlock(lastBlock, chain) {
    // write file with last block
    const saveBlock = {
        lastBlock: lastBlock
    };
    const data = JSON.stringify(saveBlock);
    try {
        fs.writeFileSync(path.resolve("src/Files/" + chain + save), data);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
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
const startScanner = async (opts) => {
    // Launch jetski from yarn
    // @ts-ignore
    const chainName = opts.chain;
    let chain = getBlockchain(chainName);
    // @ts-ignore
    let blockNumber = opts.block;
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    let currentBlock = 0;
    if (blockNumber == 0) {
        blockNumber = getLastBlock(chainName);
        if (!blockNumber) {
            console.error('Incorrect block number');
            process.exit();
        }
    }
    if (!checkLock()) {
        // check if lock file exists
        startJetskiLoop(jetski, api, currentBlock, blockNumber, chainName);
    }
    else {
        readline.question("Thread is actually locked, did you want to unlock ? (Y/n) ", (answer) => {
            answer = answer.toLowerCase();
            if (answer == "y" || answer == "yes") {
                try {
                    fs.unlinkSync(path.resolve(threadLock));
                }
                catch (e) {
                    console.error(e);
                    console.log("Something is wrong, please delete manually root/thread.lock.json");
                }
                startJetskiLoop(jetski, api, currentBlock, blockNumber, chainName);
            }
            else {
                process.exit();
            }
        });
    }
};
exports.startScanner = startScanner;
function startJetskiLoop(jetski, api, currentBlock, blockNumber, chain) {
    // generate file for lock one thread
    startLock(blockNumber, chain);
    // launch the loop on blocks
    let interval = setInterval(async () => {
        process.on('SIGINT', () => {
            // Save last block on exit Ctrl+C
            exitProcess(blockNumber, chain);
        });
        process.on('exit', () => {
            // Save last block when app is closing
            exitProcess(blockNumber, chain);
        });
        if (!api.isConnected) {
            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');
            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');
            startJetskiLoop(jetski, api, --currentBlock, blockNumber, chain);
        }
        else {
            if (currentBlock != blockNumber) {
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;
                jetski.getBlockContent(blockNumber, api)
                    .then(async (remarks) => {
                    // Check if metadata exists
                    const rmrksWithMeta = await metaDataVerifier(remarks);
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
        }
    }, 1000 / 50);
}
exports.startJetskiLoop = startJetskiLoop;
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
        var _a, _b;
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
                if (!((_a = rmrk.collection) === null || _a === void 0 ? void 0 : _a.metaData)) {
                    globals_1.Global.blocksToRescan.push(rmrk.transaction.blockId);
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
                if (!((_b = rmrk.asset) === null || _b === void 0 ? void 0 : _b.metaData)) {
                    globals_1.Global.blocksToRescan.push(rmrk.transaction.blockId);
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