"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.startJetskiLoop = exports.startScanner = void 0;
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
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const InstanceManager_1 = require("../Instances/InstanceManager");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
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
    let chainName = opts.chain;
    let chain = getBlockchain(chainName);
    chainName = chain.constructor.name;
    console.log(chainName);
    // @ts-ignore
    let blockNumber = opts.block;
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    let currentBlock = 0;
    let blockSaved = "0";
    // Create instanceManager for saving blocks and check lock
    const jwt = GossiperFactory_1.GossiperFactory.getJwt(chainName);
    const canonize = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: jwt } });
    const instanceManager = new InstanceManager_1.InstanceManager(canonize, chainName, jwt);
    if (blockNumber == 0) {
        // get last block saved on server
        blockSaved = await instanceManager.getLastBlock().catch(e => {
            console.error(e);
        });
        if (blockSaved) {
            blockNumber = Number(blockSaved);
        }
        else {
            console.error('Incorrect block number, please try with the --block={blockNumber} option');
            process.exit();
        }
    }
    else {
        blockSaved = instanceManager.getBlock();
    }
    // get new instance ID
    const id = InstanceManager_1.InstanceManager.getNewInstanceCode();
    // check if lock exists on server
    const lockExists = await instanceManager.checkLockExists(chainName, id);
    if (!lockExists) {
        startJetskiLoop(jetski, api, currentBlock, blockNumber, Number(blockSaved), chainName, id, instanceManager);
    }
    else {
        readline.question("Thread is actually locked, did you want to clear it ? All data about this instance will be lost (Y/n) ", async (answer) => {
            answer = answer.toLowerCase();
            if (answer == "y" || answer == "yes") {
                try {
                    await instanceManager.resetInstance(chainName, id);
                }
                catch (e) {
                    console.error(e);
                }
                startJetskiLoop(jetski, api, currentBlock, blockNumber, Number(blockSaved), chainName, id, instanceManager);
            }
            else {
                process.exit();
            }
        });
    }
};
exports.startScanner = startScanner;
async function startJetskiLoop(jetski, api, currentBlock, blockNumber, lastBlockSaved, chain, id, instance) {
    // get jwt for blockchain
    // const jwt = GossiperFactory.getJwt(chain.toLowerCase());
    let instanceManager = instance;
    await instanceManager.startLock(blockNumber, id)
        .then(instanceSaved => {
        if (instanceSaved != id.toString()) {
            console.error("Something is wrong with the instance code");
            process.exit();
        }
    }).catch(e => {
        console.error(e);
        setTimeout(() => { }, 2000);
    });
    // Array of block without meta for rescan
    // let toRescan: Array<number> = [];
    let lockExists = true;
    // launch the loop on blocks
    let interval = setInterval(async () => {
        process.on('exit', async () => {
            // Save last block when app is closing
            if (!InstanceManager_1.InstanceManager.processExit) {
                await instanceManager.exitProcess(blockNumber, id);
            }
        });
        process.on('SIGINT', async () => {
            // Save last block on exit Ctrl+C
            if (!InstanceManager_1.InstanceManager.processExit) {
                await instanceManager.exitProcess(blockNumber, id);
            }
        });
        if (!api.isConnected) {
            // if Api disconnect
            clearInterval(interval);
            console.log('API is disconnected, waiting for reconnect...');
            api = await jetski.getApi();
            console.log('API reconnected, loop will now restart');
            startJetskiLoop(jetski, api, --currentBlock, blockNumber, lastBlockSaved, chain, id, instanceManager);
        }
        else {
            if (currentBlock != blockNumber) {
                // If block scanned isn't resolved, dont increment
                currentBlock = blockNumber;
                if (blockNumber - lastBlockSaved > 99) {
                    // Save block number each 100 blocks
                    try {
                        await instanceManager.saveLastBlock(chain, blockNumber, id);
                        lastBlockSaved = blockNumber;
                        // check if lock already exists
                        lockExists = await instanceManager.checkLockExists(chain, id);
                    }
                    catch (e) {
                        console.error(e);
                        console.error("Fail to save block");
                    }
                }
                // if(lockExists){
                // if file lock exists, continue scan
                // get remark objects from blockchain
                jetski.getBlockContent(blockNumber, api)
                    .then(async (remarks) => {
                    // Check if metadata exists
                    const rmrksWithMeta = await metaDataVerifier(remarks);
                    // if meta call fail, possible push for rescan later
                    // if(needRescan(rmrksWithMeta)){
                    //     toRescan.push(blockNumber);
                    // }
                    if (rmrksWithMeta.length > 0) {
                        // Gossip if array not empty
                        // create canonize for send gossips
                        let canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: instanceManager.getJwt() } });
                        // blockchain object stock gossips
                        let blockchain = GossiperFactory_1.GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
                        let gossip;
                        let gossiper;
                        let i = 0;
                        let sent = false;
                        for (const rmrk of rmrksWithMeta) {
                            sent = false;
                            // create Event or Entity Gossiper
                            gossip = new GossiperFactory_1.GossiperFactory(rmrk, canonizeManager, blockchain);
                            gossiper = await gossip.getGossiper();
                            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
                            // send every Jetski.maxPerBatch remarks
                            if (i != 0 && i % Jetski_1.Jetski.maxPerBatch == 0) {
                                await sendGossip(canonizeManager, blockNumber, blockchain)
                                    .then(() => {
                                    // Refresh objects
                                    canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: instanceManager.getJwt() } });
                                    blockchain = GossiperFactory_1.GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
                                    sent = true;
                                })
                                    .catch(async () => {
                                    await sendGossip(canonizeManager, blockNumber, blockchain)
                                        .catch(() => {
                                        sent = false;
                                    });
                                });
                                if (!sent) {
                                    continue;
                                }
                            }
                            i++;
                        }
                        if (!sent) {
                            await sendGossip(canonizeManager, blockNumber, blockchain);
                        }
                    }
                    blockNumber++;
                }).catch(e => {
                    if (e != "no rmrk") {
                        console.error(e);
                    }
                    if (e == Jetski_1.Jetski.noBlock) {
                        // If block doesn't exists, wait and try again
                        console.log('Waiting for block ...');
                        // Save last block on gossip
                        const canonize = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: instanceManager.getJwt() } });
                        instanceManager = new InstanceManager_1.InstanceManager(canonize, chain, instanceManager.getJwt());
                        instanceManager.saveLastBlock(chain, blockNumber, id);
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
                // }else{
                //     // else stop the scan
                //     await instanceManager.exitProcess(blockNumber, id);
                // }
            }
        }
    }, 1000 / 50);
}
exports.startJetskiLoop = startJetskiLoop;
async function sendGossip(canonizeManager, block, blockchain) {
    return new Promise(async (resolve, reject) => {
        if (blockchain) {
            let sent = false;
            let errorMsg = "";
            if (canonizeManager.getTokenFactory().entityArray.length > 0) {
                await canonizeManager.gossipOrbsBindings()
                    .then((r) => {
                    console.log(block + " asset : " + r);
                    sent = true;
                })
                    .catch((e) => {
                    errorMsg += "\n assets : " + e;
                    console.error(e);
                });
            }
            if (canonizeManager.getAssetCollectionFactory().entityArray.length > 0) {
                await canonizeManager.gossipCollection()
                    .then((r) => {
                    console.log(block + " collection : " + r);
                    sent = true;
                }).catch((e) => {
                    errorMsg += "\n collections : " + e;
                    console.error(e);
                });
            }
            if (blockchain.eventFactory.entityArray.length > 0) {
                await canonizeManager.gossipBlockchainEvents(blockchain).then((r) => {
                    console.log(block + " event gossiped " + r);
                    sent = true;
                    resolve("send");
                }).catch(async (e) => {
                    console.error(e);
                    await canonizeManager.gossipBlockchainEvents(blockchain).then(() => {
                        resolve("send");
                    }).catch((e) => {
                        errorMsg += "\n events : " + e;
                    });
                });
            }
            if (!sent && errorMsg != "") {
                reject(errorMsg);
            }
            else {
                resolve("send");
            }
        }
    });
}
const scan = async (opts) => {
    // scan only one block
    // @ts-ignore
    let chain = getBlockchain(opts.chain);
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    // @ts-ignore
    const blockN = opts.block;
    jetski.getBlockContent(blockN, api).then(async (result) => {
        const rmrks = await metaDataVerifier(result);
        const chainName = chain.constructor.name.toLowerCase();
        // get jwt for blockchain
        const jwt = GossiperFactory_1.GossiperFactory.getJwt(chainName);
        // create canonize for stock gossips and flush it
        let canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: jwt } });
        // blockchain stock gossips too
        let blockchain = GossiperFactory_1.GossiperFactory.getCanonizeChain(chainName, canonizeManager.getSandra());
        let sent = false;
        let i = 0;
        for (const rmrk of rmrks) {
            sent = false;
            const gossip = new GossiperFactory_1.GossiperFactory(rmrk, canonizeManager, blockchain);
            const gossiper = await gossip.getGossiper();
            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
            i++;
            if (i != 0 && i % Jetski_1.Jetski.maxPerBatch == 0) {
                await sendGossip(canonizeManager, blockN, blockchain).then(() => {
                    // Refresh objects
                    canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: jwt } });
                    blockchain = GossiperFactory_1.GossiperFactory.getCanonizeChain(chainName, canonizeManager.getSandra());
                    sent = true;
                });
            }
        }
        if (!sent) {
            await sendGossip(canonizeManager, blockN, blockchain);
        }
        setTimeout(() => {
            process.exit();
        }, 2000);
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
//# sourceMappingURL=StartScan.js.map