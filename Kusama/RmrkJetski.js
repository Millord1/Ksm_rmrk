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
class RmrkJetski {
    constructor(chain) {
        this.chain = chain;
        this.wsProvider = new api_1.WsProvider(this.chain.wsProvider);
    }
    getApi() {
        return __awaiter(this, void 0, void 0, function* () {
            let myApi;
            if (typeof this.api === 'undefined') {
                myApi = yield api_1.ApiPromise.create({ provider: this.wsProvider });
            }
            else {
                myApi = this.api;
            }
            return myApi;
        });
    }
    getRmrks(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.getApi();
            const blockHash = yield api.rpc.chain.getBlockHash(blockNumber);
            const block = yield api.rpc.chain.getBlock(blockHash);
            // const remarks = await api.tx.system.remark;
            //
            // console.log(remarks);
            let blockId = blockNumber;
            let blockTimestamp;
            blockTimestamp = '0';
            const blockRmrks = [];
            for (const ex of block.block.extrinsics) {
                const { method: { args, method, section } } = ex;
                //note timestamp extrinsic always comes first on a block
                if (section === "timestamp" && method === "set") {
                    blockTimestamp = getTimestamp(ex);
                }
                if (section === "system" && method === "remark") {
                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    const hash = ex.hash.toHex();
                    const tx = new Transaction_js_1.Transaction(this.chain, blockId, hash, blockTimestamp, signer, null);
                    if (remark.indexOf("") === 0) {
                        const uri = util_1.hexToString(remark);
                        let lisibleUri = decodeURIComponent(uri);
                        lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');
                        console.log(lisibleUri);
                        const splitted = lisibleUri.split('::');
                        const data = Entity_js_1.Entity.dataTreatment(splitted, Entity_js_1.Entity.entityObj);
                        let meta;
                        if (data.metadata !== "") {
                            meta = yield Entity_js_1.Entity.getMetaDataContent(data.metadata);
                        }
                        else {
                            meta = null;
                        }
                        const reader = new RmrkReader_js_1.RmrkReader(this.chain, tx);
                        const rmrkReader = reader.readInteraction(lisibleUri, meta);
                        blockRmrks.push(rmrkReader);
                    }
                }
            }
            return blockRmrks;
        });
    }
}
exports.RmrkJetski = RmrkJetski;
function getTimestamp(ex) {
    let argString = ex.args.toString();
    let secondTimestamp = Number(argString) / 1000;
    return secondTimestamp.toString();
}
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