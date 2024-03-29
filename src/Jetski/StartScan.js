"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.startJetskiLoop = exports.startScanner = void 0;
const Kusama_1 = require("../Blockchains/Kusama");
const Jetski_1 = require("./Jetski");
const GossiperFactory_1 = require("../Gossiper/GossiperFactory");
const MetaData_1 = require("../Remark/MetaData");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const Mint_1 = require("../Remark/Interactions/Mint");
const WestEnd_1 = require("../Blockchains/WestEnd");
const Polkadot_1 = require("../Blockchains/Polkadot");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const InstanceManager_1 = require("../Instances/InstanceManager");
const fs = require('fs');
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
        entity = rmrk.getEntity();
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
    let env = opts.env;
    // @ts-ignore
    let blockNumber = opts.block;
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    let currentBlock = 0;
    let blockSaved = "0";
    // Create instanceManager for saving blocks and check lock
    const jwt = GossiperFactory_1.GossiperFactory.getJwt(chainName, env);
    console.log(jwt);
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
    // launch the loop on blocks
    let interval = setInterval(async () => {
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
                            const rmrkLength = rmrksWithMeta.length;
                            const lastRmrk = i === rmrkLength - 1;
                            sent = false;
                            // create Event, Order or Entity Gossiper
                            gossip = new GossiperFactory_1.GossiperFactory(rmrk, canonizeManager, blockchain);
                            gossiper = await gossip.getGossiper();
                            gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip();
                            if (rmrkLength > Jetski_1.Jetski.maxPerBatch) {
                                // send every Jetski.maxPerBatch remarks
                                if (i != 0 && i % Jetski_1.Jetski.maxPerBatch == 0 || lastRmrk) {
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
                            }
                            else if (rmrkLength > Jetski_1.Jetski.minForEggs || lastRmrk) {
                                if (i > 0 && i % Jetski_1.Jetski.minForEggs == 0) {
                                    await sendGossip(canonizeManager, blockNumber, blockchain).then(() => {
                                        blockchain = GossiperFactory_1.GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
                                        sent = true;
                                    });
                                }
                            }
                            else {
                                // If there is less remarks than Jetski.maxPerBatch
                                await sendGossip(canonizeManager, blockNumber, blockchain).then(() => {
                                    sent = true;
                                });
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
            const collectionEntities = canonizeManager.getAssetCollectionFactory().entityArray;
            const assetEntities = canonizeManager.getAssetFactory().entityArray;
            // const changeIssuerEntities = canonizeManager.getChangeIssuerFactory().entityArray;
            // Send if canonizer not empty
            if (collectionEntities.length > 0) {
                await canonizeManager.gossipCollection()
                    .then((r) => {
                    console.log(block + " collection : " + r);
                    sent = true;
                }).catch((e) => {
                    errorMsg += "\n collections : " + e;
                    console.error(e);
                });
            }
            if (assetEntities.length > 0) {
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
            // Send if canonizer not empty
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
            if (blockchain.orderFactory.entityArray.length > 0) {
                await canonizeManager.gossipBlockchainOrder(blockchain).then((r) => {
                    console.log(block + " order gossiped " + r);
                    sent = true;
                    resolve("send");
                }).catch(async (e) => {
                    console.error(e);
                    await canonizeManager.gossipBlockchainOrder(blockchain).then(() => {
                        resolve("send");
                    }).catch((e) => {
                        errorMsg += "\n events : " + e;
                    });
                });
            }
            if (blockchain.emoteFactory.entityArray.length > 0) {
                await canonizeManager.gossipBlockchainEmote(blockchain).then((r) => {
                    console.log(block + " emote gossiped " + r);
                    sent = true;
                    resolve("send");
                }).catch(async (e) => {
                    console.error(e);
                    await canonizeManager.gossipBlockchainEmote(blockchain).then(() => {
                        resolve("send");
                    }).catch((e) => {
                        errorMsg += "\n emotes : " + e;
                    });
                });
            }
            if (blockchain.changeIssuerFactory.entityArray.length > 0) {
                await canonizeManager.gossipChangeIssuer(blockchain.changeIssuerFactory).then((r) => {
                    console.log(block + " changeIssuer gossiped " + r);
                    sent = true;
                    resolve("send");
                }).catch(async (e) => {
                    console.error(e);
                    await canonizeManager.gossipChangeIssuer(blockchain.changeIssuerFactory).then(() => {
                        resolve("send");
                    }).catch((e) => {
                        errorMsg += "\n changeIssuer : " + e;
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
    let env = opts.env;
    // @ts-ignore
    const blockN = opts.block;
    jetski.getBlockContent(blockN, api).then(async (result) => {
        const rmrks = await metaDataVerifier(result);
        const chainName = chain.constructor.name.toLowerCase();
        // get jwt for blockchain
        const jwt = GossiperFactory_1.GossiperFactory.getJwt(chainName, env);
        // create canonize for stock gossips and flush it
        let canonizeManager = new CSCanonizeManager_1.CSCanonizeManager({ connector: { gossipUrl: GossiperFactory_1.GossiperFactory.gossipUrl, jwt: jwt } });
        // blockchain stock gossips too
        // let blockchain = GossiperFactory.getCanonizeChain(chainName, canonizeManager.getSandra());
        let blockchain = canonizeManager.getOrInitBlockchain(CSCanonizeManager_1.CompatibleBlockchains.kusama);
        let sent = false;
        let i = 0;
        for (const rmrk of rmrks) {
            sent = false;
            const gossip = new GossiperFactory_1.GossiperFactory(rmrk, canonizeManager, blockchain);
            const gossiper = await gossip.getGossiper();
            // await gossiper?.gossip();
            //
            // const myGossiper = new Gossiper(blockchain.changeIssuerFactory);
            // const json = myGossiper.exposeGossip();
            // fs.writeFileSync("changeIssuer.json", JSON.stringify(json));
            // process.exit();
            await (gossiper === null || gossiper === void 0 ? void 0 : gossiper.gossip());
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
        let rmrkToRecall = [];
        let allRemarks = [];
        let needRecall = false;
        for (const rmrk of remarks) {
            if (rmrk instanceof Mint_1.Mint || rmrk instanceof MintNft_1.MintNft) {
                let entity = rmrk.getEntity();
                if (!(entity === null || entity === void 0 ? void 0 : entity.metaData)) {
                    needRecall = true;
                    rmrkToRecall.push(rmrk);
                }
            }
            else {
                allRemarks.push(rmrk);
            }
        }
        if (needRecall) {
            let rmrkRecalled = [];
            if (rmrkToRecall.length > 0) {
                rmrkRecalled = await MetaData_1.MetaData.getMetaOnArray(rmrkToRecall);
            }
            remarks = allRemarks.concat(rmrkRecalled);
        }
        resolve(remarks);
    });
}
//# sourceMappingURL=StartScan.js.map