"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmrkBlockchain = void 0;
const Blockchain_1 = require("./Blockchain");
const Transaction_1 = require("../Remark/Transaction");
const Jetski_1 = require("../Jetski/Jetski");
const fs = require('fs');
class RmrkBlockchain extends Blockchain_1.Blockchain {
    constructor(symbol, prefix, isSubstrate, wsProvider, decimale) {
        super(symbol, prefix, isSubstrate, wsProvider, decimale);
    }
    async getBlockData(block, blockId, blockTimestamp, chain, jetski) {
        return new Promise(async (resolve, reject) => {
            let dataArray = [];
            for (const ex of block.block ? block.block.extrinsics : []) {
                const { method: { args, method, section } } = ex;
                if (section === "timestamp" && method === "set") {
                    blockTimestamp = Jetski_1.Jetski.getTimestamp(ex);
                }
                const dateTimestamp = Number(blockTimestamp) * 1000;
                const date = new Date(dateTimestamp);
                // Display block date and number
                console.log('block ' + blockId + ' ' + date);
                if (section === "system" && method === "remark") {
                    // If block have simple remark
                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();
                    // Create transaction with block's info
                    const tx = new Transaction_1.Transaction(blockId, hash, blockTimestamp, chain, signer);
                    if (remark.indexOf("") === 0) {
                        // Create object from rmrk
                        dataArray.push(jetski.getObjectFromRemark(remark, tx));
                    }
                }
                if (section === "utility" && method.includes("batch")) {
                    // If rmrks are in batch
                    const arg = args.toString();
                    const batch = JSON.parse(arg);
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();
                    let i = 1;
                    // if batch bigger than 200 rmrks
                    if (batch.length >= Jetski_1.Jetski.minForEggs) {
                        dataArray = await jetski.eggExplorer(batch, signer, hash, blockId, blockTimestamp, 0);
                    }
                    else {
                        dataArray = await jetski.pushRemarks(batch, hash, blockId, blockTimestamp, signer, i, dataArray);
                    }
                }
            }
            Promise.all(dataArray).then(result => {
                resolve(result);
            }).catch(r => {
                reject(r);
                return;
            });
        });
    }
    async sendGossip(canonizeManager, block, blockchain) {
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
}
exports.RmrkBlockchain = RmrkBlockchain;
//# sourceMappingURL=RmrkBlockchain.js.map