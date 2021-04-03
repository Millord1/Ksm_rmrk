"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jetski = void 0;
const api_1 = require("@polkadot/api");
const Interaction_1 = require("../Remark/Interactions/Interaction");
const Transaction_1 = require("../Remark/Transaction");
const util_1 = require("@polkadot/util");
const RmrkReader_1 = require("./RmrkReader");
const MetaData_1 = require("../Remark/MetaData");
const Mint_1 = require("../Remark/Interactions/Mint");
const Entity_1 = require("../Remark/Entities/Entity");
const MintNft_1 = require("../Remark/Interactions/MintNft");
class Jetski {
    constructor(chain) {
        this.chain = chain;
        this.wsProvider = new api_1.WsProvider(this.chain.wsProvider);
    }
    async getApi() {
        let api;
        api = await api_1.ApiPromise.create({ provider: this.wsProvider });
        return api;
    }
    async getBlockContent(blockNumber, api) {
        return new Promise(async (resolve, reject) => {
            let blockRmrk = [];
            let blockHash;
            try {
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            }
            catch (e) {
                // console.log(e);
                reject(Jetski.noBlock);
            }
            // Get block from APi
            const block = await api.rpc.chain.getBlock(blockHash);
            let blockId = blockNumber;
            let blockTimestamp = "";
            if (block.block == null) {
                reject(Jetski.noBlock);
            }
            for (const ex of block.block ? block.block.extrinsics : []) {
                const { method: { args, method, section } } = ex;
                if (section === "timestamp" && method === "set") {
                    blockTimestamp = Jetski.getTimestamp(ex);
                }
                const dateTimestamp = Number(blockTimestamp) * 1000;
                const date = new Date(dateTimestamp);
                // Display block date and number
                console.log('block ' + blockNumber + ' ' + date);
                if (section === "system" && method === "remark") {
                    // If block have simple remark
                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();
                    // Create transaction with block's info
                    const tx = new Transaction_1.Transaction(blockId, hash, blockTimestamp, this.chain, signer);
                    if (remark.indexOf("") === 0) {
                        // Create object from rmrk
                        blockRmrk.push(this.getObjectFromRemark(remark, tx));
                    }
                }
                if (section === "utility" && method.includes("batch")) {
                    // If rmrks are in batch
                    const arg = args.toString();
                    const batch = JSON.parse(arg);
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();
                    // Transfer object for complement Buy data (payment address and value)
                    const transfer = Jetski.checkIfTransfer(batch);
                    let i = 1;
                    for (const rmrkObj of batch) {
                        // Increment tx Hash
                        const txHash = hash + '-' + i;
                        const destination = transfer ? transfer.destination : undefined;
                        const value = transfer ? transfer.value : undefined;
                        const tx = new Transaction_1.Transaction(blockId, txHash, blockTimestamp, this.chain, signer, destination, value);
                        if (rmrkObj.args.hasOwnProperty('_remark')) {
                            // If batch have rmrk
                            blockRmrk.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
                        }
                        i += 1;
                    }
                }
            }
            return Promise.all(blockRmrk)
                .then(async (result) => {
                let interactions;
                try {
                    interactions = await this.getMetadataContent(result);
                    resolve(interactions);
                }
                catch (e) {
                    // retry if doesn't work
                    try {
                        interactions = await this.getMetadataContent(result);
                        resolve(interactions);
                    }
                    catch (e) {
                        console.error(e);
                        reject(e);
                    }
                }
            })
                .catch(e => {
                reject(e);
            });
        });
    }
    static checkIfTransfer(batch) {
        // Check if batch have rmrk and transfer for Buy
        let isRemark = false;
        let isTransfert = false;
        const transfert = {
            destination: "",
            value: ""
        };
        for (let i = 0; i < batch.length; i++) {
            const args = batch[i].args;
            if (args.hasOwnProperty('_remark')) {
                isRemark = true;
            }
            if (isRemark) {
                if (args.hasOwnProperty('dest') && args.hasOwnProperty('value')) {
                    transfert.destination = args.dest.Id;
                    transfert.value = args.value;
                    isTransfert = true;
                }
            }
        }
        return isTransfert ? transfert : undefined;
    }
    async getMetadataContent(interactions) {
        // Resolve all promises with metadata
        return new Promise(async (resolve, reject) => {
            let rmrkWithMeta = [];
            let i = 0;
            for (const rmrk of interactions) {
                if (rmrk instanceof Mint_1.Mint || rmrk instanceof MintNft_1.MintNft) {
                    rmrkWithMeta.push(this.callMeta(rmrk, i));
                }
                else if (rmrk instanceof Interaction_1.Interaction) {
                    rmrkWithMeta.push(rmrk);
                }
                i++;
            }
            return Promise.all(rmrkWithMeta)
                .then((remarks) => {
                resolve(remarks);
            }).catch(e => {
                // console.error(e);
                reject(e);
            });
        });
    }
    async callMeta(remark, index) {
        let entity;
        if (remark instanceof Mint_1.Mint) {
            if (remark.collection) {
                entity = remark.collection;
            }
        }
        else if (remark instanceof MintNft_1.MintNft) {
            if (remark.asset) {
                entity = remark.asset;
            }
        }
        return new Promise((resolve, reject) => {
            if (entity) {
                MetaData_1.MetaData.getMetaData(entity.url, index).then(meta => {
                    entity === null || entity === void 0 ? void 0 : entity.addMetadata(meta);
                    resolve(remark);
                }).catch((e) => {
                    // console.error(e);
                    resolve(remark);
                });
            }
            else {
                reject(Entity_1.Entity.undefinedEntity);
            }
        });
    }
    getObjectFromRemark(remark, transaction) {
        // Promise create an object with rmrk
        return new Promise((resolve, reject) => {
            const uri = util_1.hexToString(remark);
            let url = "";
            try {
                url = decodeURIComponent(uri);
            }
            catch (e) {
                reject(e);
            }
            const reader = new RmrkReader_1.RmrkReader(this.chain, transaction);
            const rmrk = reader.readInteraction(url);
            if (rmrk instanceof Interaction_1.Interaction) {
                resolve(rmrk);
            }
            else {
                resolve('no rmrk');
            }
        });
    }
    static getTimestamp(ex) {
        let argString = ex.args.toString();
        let secondTimestamp = Number(argString) / 1000;
        return secondTimestamp.toString();
    }
    async getBigBlock(blockNumber, api, count) {
        return new Promise(async (resolve, reject) => {
            let blockRmrk = [];
            let blockHash;
            try {
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
            }
            catch (e) {
                // console.log(e);
                reject(Jetski.noBlock);
            }
            // Get block from API
            const block = await api.rpc.chain.getBlock(blockHash);
            let blockId = blockNumber;
            let blockTimestamp = "";
            if (block.block == null) {
                reject(Jetski.noBlock);
            }
            for (const ex of block.block ? block.block.extrinsics : []) {
                const { method: { args, method, section } } = ex;
                if (section === "timestamp" && method === "set") {
                    blockTimestamp = Jetski.getTimestamp(ex);
                }
                const dateTimestamp = Number(blockTimestamp) * 1000;
                const date = new Date(dateTimestamp);
                // Display block date and number
                console.log('block ' + blockNumber + ' ' + date);
                if (section === "utility" && method.includes("batch")) {
                    // If rmrks are in batch
                    const arg = args.toString();
                    let batch = JSON.parse(arg);
                    if (!batch) {
                        setTimeout(() => {
                            console.log("no more batch");
                            // process.exit();
                        }, 5000);
                    }
                    const totalLength = batch.length;
                    let start;
                    if (count == 0) {
                        start = count;
                    }
                    else {
                        start = count * 500;
                    }
                    console.log("start : " + start);
                    let stop = start + 500;
                    if (start > totalLength) {
                        console.log("This block is finished");
                        process.exit();
                    }
                    if (stop > totalLength) {
                        stop = totalLength;
                        setTimeout(() => {
                            console.log("LAST");
                        }, 1000);
                    }
                    batch = batch.slice(start, stop);
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();
                    // Transfer object for complement Buy data (payment address and value)
                    const transfer = Jetski.checkIfTransfer(batch);
                    let i = 1;
                    for (const rmrkObj of batch) {
                        // Increment tx Hash
                        const txHash = hash + '-' + i;
                        const destination = transfer ? transfer.destination : undefined;
                        const value = transfer ? transfer.value : undefined;
                        const tx = new Transaction_1.Transaction(blockId, txHash, blockTimestamp, this.chain, signer, destination, value);
                        if (rmrkObj.args.hasOwnProperty('_remark')) {
                            // If batch have rmrk
                            blockRmrk.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
                        }
                        i += 1;
                    }
                }
            }
            return Promise.all(blockRmrk)
                .then(async (result) => {
                let interactions;
                try {
                    interactions = await this.getMetadataContent(result);
                    resolve(interactions);
                }
                catch (e) {
                    // retry if doesn't work
                    try {
                        interactions = await this.getMetadataContent(result);
                        resolve(interactions);
                    }
                    catch (e) {
                        console.error(e);
                        reject(e);
                    }
                }
            })
                .catch(e => {
                reject(e);
            });
        });
    }
}
exports.Jetski = Jetski;
Jetski.noBlock = "No Block";
//# sourceMappingURL=Jetski.js.map