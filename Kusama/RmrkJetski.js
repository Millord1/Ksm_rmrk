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
            const blockRmrks = [];
            // const signedBlock = await api.rpc.chain.getBlock();
            // const blockDatas = await api.query.system.events.at(signedBlock.block.header.hash);
            //
            // //@ts-ignore
            // signedBlock.block.extrinsics.forEach(({ method: {method, section} }, index) => {
            //     //@ts-ignore
            //     const events = blockDatas.filter(({ phase }) =>
            //     phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index))
            //         //@ts-ignore
            //         .map(({ event }) => `${event.section}.${event.method}`);
            //
            //     console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
            // })
            block.block.extrinsics.forEach((ex) => {
                // console.log("showing method")
                // console.log(ex);
                console.log(ex.hash.toHex());
                const { method: { args, method, section } } = ex;
                // console.log(ex.events);
                if (section === "system" && method === "remark") {
                    // console.log(ex)
                    const remark = args.toString();
                    const signer = ex.signer.toString();
                    // const signature = ex.signature.toString();
                    // findHash(api, signer);
                    if (remark.indexOf("") === 0) {
                        // const uri = hexToString('0x7b2276657273696f6e223a22524d524b302e31222c226e616d65223a22446f74204c656170204561726c792050726f6d6f74657273222c226d6178223a203130302c22697373756572223a2243706a734c4443314a467972686d3366744339477334516f79726b484b685a4b744b37597147545246745461666770222c2273796d626f6c223a22444c4550222c226964223a22306166663638363562656433613636622d444c4550222c226d65746164617461223a22697066733a2f2f697066732f516d5667733850346177685a704658686b6b676e437742703441644b526a3346394b35386d435a366678766e336a227d');
                        const uri = util_1.hexToString(remark);
                        let lisibleUri = decodeURIComponent(uri);
                        lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');
                        const reader = new RmrkReader_js_1.RmrkReader(this.chain, signer);
                        const rmrkReader = reader.readRmrk(lisibleUri);
                        blockRmrks.push(rmrkReader);
                    }
                }
            });
            return blockRmrks;
        });
    }
}
exports.RmrkJetski = RmrkJetski;
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