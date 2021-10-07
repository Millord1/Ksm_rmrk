"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jetski = exports.entityFound = exports.metaCalled = void 0;
const api_1 = require("@polkadot/api");
const Interaction_1 = require("../Remark/Interactions/Interaction");
const Transaction_1 = require("../Remark/Transaction");
const util_1 = require("@polkadot/util");
const RmrkReader_1 = require("./RmrkReader");
const MetaData_1 = require("../Remark/MetaData");
const Mint_1 = require("../Remark/Interactions/Mint");
const MintNft_1 = require("../Remark/Interactions/MintNft");
const CSCanonizeManager_1 = require("canonizer/src/canonizer/CSCanonizeManager");
const ChangeIssuer_1 = require("../Remark/Interactions/ChangeIssuer");
const RmrkBlockchain_1 = require("../Blockchains/RmrkBlockchain");
exports.metaCalled = [];
exports.entityFound = [];
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
        // Clear meta storage at each block
        exports.metaCalled = [];
        exports.entityFound = [];
        return new Promise(async (resolve, reject) => {
            // let blockRmrk: Array<Promise<Interaction|string>> = [];
            let blockHash;
            let block;
            try {
                blockHash = await api.rpc.chain.getBlockHash(blockNumber);
                // if (blockHash == "0x0000000000000000000000000000000000000000000000000000000000000000") {
                if (blockHash.includes(CSCanonizeManager_1.CSCanonizeManager.mintIssuerAddressString)) {
                    reject(Jetski.noBlock);
                    return;
                }
            }
            catch (e) {
                reject(Jetski.noBlock);
                return;
            }
            // Get block from APi
            try {
                block = await api.rpc.chain.getBlock(blockHash);
            }
            catch (e) {
                reject(Jetski.noBlock);
                return;
            }
            let blockId = blockNumber;
            let blockTimestamp = "";
            if (block.block == null) {
                reject(Jetski.noBlock);
                return;
            }
            // blockRmrk = await this.chain.getBlockData(block, blockId, blockTimestamp, this.chain, blockRmrk, this);
            // for (const ex of block.block ? block.block.extrinsics : []){
            //
            //     const { method: {
            //         args, method, section
            //     } } = ex;
            //
            //     if(section === "timestamp" && method === "set"){
            //         blockTimestamp = Jetski.getTimestamp(ex);
            //     }
            //
            //     const dateTimestamp = Number(blockTimestamp) * 1000;
            //     const date = new Date(dateTimestamp);
            //     // Display block date and number
            //     console.log('block ' + blockNumber + ' ' + date);
            //
            //     if(section === "system" && method === "remark"){
            //         // If block have simple remark
            //
            //         const remark = args.toString();
            //         const signer = ex.signer.toString();
            //         const hash = ex.hash.toHex();
            //
            //         // Create transaction with block's info
            //         const tx = new Transaction(blockId, hash, blockTimestamp, this.chain, signer);
            //
            //         if(remark.indexOf("") === 0){
            //             // Create object from rmrk
            //
            //             blockRmrk.push(this.getObjectFromRemark(remark, tx));
            //
            //         }
            //     }
            //
            //     if(section === "utility" && method.includes("batch")){
            //         // If rmrks are in batch
            //
            //         const arg = args.toString();
            //         const batch = JSON.parse(arg);
            //
            //         const signer = ex.signer.toString();
            //         const hash = ex.hash.toHex();
            //
            //         let i = 1;
            //
            //         // if batch bigger than 200 rmrks
            //         if(batch.length >= Jetski.minForEggs){
            //             blockRmrk = await this.eggExplorer(batch, signer, hash, blockId, blockTimestamp, 0);
            //         }else{
            //             blockRmrk = await this.pushRemarks(batch, hash, blockId, blockTimestamp, signer, i, blockRmrk);
            //         }
            //     }
            // }
            //
            // return Promise.all(blockRmrk)
            //     .then(async result=>{
            //
            //         const isOnlyStrings = (element: string|Interaction) => typeof element == "string";
            //
            //         if(result.every(isOnlyStrings)){
            //             reject ("no rmrk");
            //         }
            //
            //         let interactions;
            //
            //         try{
            //             interactions = await this.getMetadataContent(result);
            //             resolve (interactions);
            //         }catch(e){
            //             // retry if doesn't work
            //             try{
            //                 interactions = await this.getMetadataContent(result);
            //                 resolve (interactions);
            //             }catch(e){
            //                 console.error(e);
            //                 reject (e);
            //             }
            //         }
            //
            //     })
            //     .catch(e=>{
            //         reject(e);
            //     })
            this.chain.getBlockData(block, blockId, blockTimestamp, this.chain, this)
                .then(async (result) => {
                const isOnlyStrings = (element) => typeof element == "string";
                if (result.every(isOnlyStrings)) {
                    reject("no rmrk");
                    return;
                }
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
                return;
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
            if (isRemark && !isTransfert) {
                if (args.hasOwnProperty('dest') && args.hasOwnProperty('value')) {
                    transfert.destination = args.dest.id;
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
            let interactArray = [];
            let toCall = [];
            for (const rmrk of interactions) {
                if (rmrk instanceof Mint_1.Mint || rmrk instanceof MintNft_1.MintNft) {
                    toCall.push(rmrk);
                }
                else if (rmrk instanceof Interaction_1.Interaction) {
                    interactArray.push(rmrk);
                }
            }
            const rmrkWithMeta = await MetaData_1.MetaData.getMetaOnArray(toCall);
            const allRemarks = interactArray.concat(rmrkWithMeta);
            resolve(allRemarks);
        });
    }
    // private async callMeta(remark: Interaction, index?: number): Promise<Interaction>
    // {
    //
    //     let entity: Entity|undefined;
    //
    //     if(remark instanceof Mint){
    //
    //         if(remark.collection){
    //             entity = remark.collection;
    //         }
    //
    //     }else if(remark instanceof MintNft){
    //
    //         if(remark.asset){
    //             entity = remark.asset;
    //         }
    //     }
    //
    //     return new Promise((resolve, reject)=>{
    //
    //         if(entity){
    //
    //             const metaAlreadyCalled = metaCalled.find(meta => meta.url === entity?.url);
    //
    //             // if call on this url already been made (stocked in array metaCalled)
    //             if(metaAlreadyCalled && metaAlreadyCalled.meta){
    //                 entity.addMetadata(metaAlreadyCalled.meta);
    //             }else{
    //                 MetaData.getMetaData(entity.url, index).then(meta=>{
    //                     entity?.addMetadata(meta);
    //                     resolve(remark);0
    //                 }).catch((e)=>{
    //                     // console.error(e);
    //                     resolve(remark);
    //                 })
    //             }
    //
    //         }else{
    //             reject(Entity.undefinedEntity);
    //         }
    //
    //     })
    //
    // }
    getObjectFromRemark(remark, transaction) {
        // Promise create an object with rmrk
        return new Promise((resolve, reject) => {
            const uri = (0, util_1.hexToString)(remark);
            let url = "";
            try {
                url = decodeURIComponent(uri);
            }
            catch (e) {
                reject(e);
                return;
            }
            const reader = new RmrkReader_1.RmrkReader(this.chain, transaction);
            const rmrk = reader.readInteraction(url);
            if (!(rmrk instanceof ChangeIssuer_1.ChangeIssuer)) {
                if (!(rmrk === null || rmrk === void 0 ? void 0 : rmrk.getEntity())) {
                    resolve("no rmrk");
                }
            }
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
    async pushRemarks(batch, hash, blockId, timestamp, signer, start, remarks = []) {
        const transfer = Jetski.checkIfTransfer(batch);
        let i = start;
        for (const rmrkObj of batch) {
            // Increment tx Hash
            const txHash = hash + '-' + i;
            const destination = transfer ? transfer.destination : undefined;
            const value = transfer ? transfer.value : undefined;
            const tx = new Transaction_1.Transaction(blockId, txHash, timestamp, this.chain, signer, destination, value);
            if (rmrkObj.args.hasOwnProperty('_remark')) {
                // If batch have rmrk
                remarks.push(this.getObjectFromRemark(rmrkObj.args._remark, tx));
            }
            i += 1;
        }
        return remarks;
    }
    async eggExplorer(batch, signer, hash, blockId, timestamp, count, remarks = []) {
        // create remarks from big batch
        return new Promise(async (resolve) => {
            const totalLength = batch.length;
            let start;
            if (count == 0) {
                start = count;
            }
            else {
                start = count * Jetski.maxPerBatch;
            }
            let stop = start + Jetski.maxPerBatch;
            if (start > totalLength) {
                console.log("This block is finished");
                resolve(remarks);
            }
            if (stop > totalLength) {
                stop = totalLength;
            }
            const myBatch = [];
            for (let i = start; i < stop; i++) {
                if (batch[i]) {
                    myBatch.push(batch[i]);
                }
            }
            if (myBatch.length == 0) {
                resolve(remarks);
            }
            if (this.chain instanceof RmrkBlockchain_1.RmrkBlockchain) {
                remarks = await this.pushRemarks(myBatch, hash, blockId, timestamp, signer, start, remarks);
            }
            else {
                // TODO for classic chain
                // remarks = await
            }
            // if batch still have remarks to process
            if (stop != totalLength) {
                await this.eggExplorer(batch, signer, hash, blockId, timestamp, ++count, remarks);
            }
            resolve(remarks);
        });
    }
}
exports.Jetski = Jetski;
Jetski.noBlock = "No Block";
Jetski.maxPerBatch = 100;
Jetski.minForEggs = 10;
//# sourceMappingURL=Jetski.js.map