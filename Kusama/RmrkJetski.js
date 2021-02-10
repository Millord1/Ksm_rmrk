"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmrkJetski = void 0;
const api_1 = require("@polkadot/api");
const util_1 = require("@polkadot/util");
const RmrkReader_js_1 = require("./RmrkReader.js");
const Transaction_js_1 = require("../classes/Transaction.js");
const Entity_js_1 = require("../classes/Rmrk/Entity.js");
const Interaction_js_1 = require("../classes/Rmrk/Interaction.js");
class RmrkJetski {
    constructor(chain) {
        this.chain = chain;
        this.wsProvider = new api_1.WsProvider(this.chain.wsProvider);
    }
    getApi() {
        return __awaiter(this, void 0, void 0, function* () {
            let myApi;
            // if (typeof this.api === 'undefined'){
            //     myApi = await ApiPromise.create({ provider: this.wsProvider });
            // }else{
            //     myApi = this.api;
            // }
            myApi = api_1.ApiPromise.create({ provider: this.wsProvider });
            return myApi;
        });
    }
    getRmrks(blockNumber, api) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const blockHash = yield api.rpc.chain.getBlockHash(blockNumber);
                const block = yield api.rpc.chain.getBlock(blockHash);
                let blockId = blockNumber;
                let blockTimestamp = '0';
                let blockRmrks = [];
                for (const ex of block.block.extrinsics) {
                    const { method: { args, method, section } } = ex;
                    if (section === "timestamp" && method === "set") {
                        blockTimestamp = getTimestamp(ex);
                    }
                    const timestampToDate = Number(blockTimestamp) * 1000;
                    const date = new Date(timestampToDate);
                    console.log('block ' + blockNumber + ' ' + date);
                    if (section === "system" && method === "remark") {
                        const remark = args.toString();
                        const signer = ex.signer.toString();
                        const hash = ex.hash.toHex();
                        const tx = new Transaction_js_1.Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);
                        if (remark.indexOf("") === 0) {
                            blockRmrks.push(this.rmrkToObject(remark, tx));
                        }
                    }
                    if (section === "utility" && method === "batch") {
                        const arg = args.toString();
                        const batch = JSON.parse(arg);
                        const signer = ex.signer.toString();
                        let hash = ex.hash.toHex();
                        let i = 1;
                        for (const rmrkObj of batch) {
                            hash = hash + '-' + i;
                            const tx = new Transaction_js_1.Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);
                            if (rmrkObj.args.hasOwnProperty('_remark')) {
                                blockRmrks.push(this.rmrkToObject(rmrkObj.args._remark, tx));
                            }
                            i += 1;
                        }
                    }
                }
                return Promise.all(blockRmrks)
                    .then(value => {
                    resolve(value);
                }).catch((e) => {
                    console.log(e);
                });
            }));
        });
    }
    rmrkToObject(remark, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const uri = util_1.hexToString(remark);
                let lisibleUri = decodeURIComponent(uri);
                lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');
                const splitted = lisibleUri.split('::');
                if (splitted.length >= 3) {
                    const data = Entity_js_1.Entity.dataTreatment(splitted, Entity_js_1.Entity.entityObj);
                    let meta;
                    if (data.metadata != "") {
                        meta = yield Entity_js_1.Entity.getMetaDataContent(data.metadata);
                    }
                    else {
                        meta = null;
                    }
                    const reader = new RmrkReader_js_1.RmrkReader(this.chain, tx);
                    const rmrk = reader.readInteraction(lisibleUri, meta);
                    if (rmrk instanceof Interaction_js_1.Interaction) {
                        resolve(rmrk);
                    }
                    else {
                        resolve('no rmrk');
                    }
                }
                else {
                    resolve('no rmrk');
                }
            }));
        });
    }
}
exports.RmrkJetski = RmrkJetski;
function getTimestamp(ex) {
    let argString = ex.args.toString();
    let secondTimestamp = Number(argString) / 1000;
    return secondTimestamp.toString();
}
// 4960570
// const scan = new RmrkJetski(new Kusama());
// FAIL
// scan.getRmrks(5445790);
// Human Json (file)
// scan.getRmrks(5445790);
//Send
// scan.getRmrks(5437975)
// MintNft
// scan.getRmrks(5420541);
// Mint
// scan.getRmrks(5083411);
// scan.getRmrks(2176215);
//# sourceMappingURL=RmrkJetski.js.map