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
const Send_js_1 = require("../classes/Rmrk/Interactions/Send.js");
const Metadatas_js_1 = require("../classes/Metadatas.js");
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
            let blockId = blockNumber;
            let blockTimestamp;
            const blockRmrks = [];
            block.block.extrinsics.forEach((ex) => {
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
                        // const uri = hexToString(remark);
                        const hexa = '0x7b22636f6c6c656374696f6e223a22306166663638363562656433613636622d444c4550222c226e616d65223a224561726c792050726f6d6f746572732076657273696f6e203135222c22696e7374616e6365223a22444c3135222c227472616e7366657261626c65223a312c22736e223a2230303030303030303030303030303031222c226d65746164617461223a22697066733a2f2f697066732f516d61766f54566256486e4745557a746e425432703372696633714250654366797955453576345a376f46767334227d';
                        const uri = util_1.hexToString(hexa);
                        let lisibleUri = decodeURIComponent(uri);
                        lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');
                        const metas = Metadatas_js_1.Metadatas.getMetadatasContent('ipfs', 'ipfs/QmTsRuRsnvg3TBjShaMmdCnsQLZQsAbLf2tCZZzgeFrFuN');
                        console.log(typeof metas);
                        const reader = new RmrkReader_js_1.RmrkReader(this.chain, tx);
                        const rmrkReader = reader.readRmrk(lisibleUri);
                        // const metas = Entity.getMetadatasContent();
                        if (rmrkReader instanceof Send_js_1.Send) {
                            blockRmrks.push(rmrkReader);
                        }
                    }
                }
            });
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