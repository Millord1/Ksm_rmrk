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
exports.BatchReader = void 0;
const api_1 = require("@polkadot/api");
const fs = require('fs');
const path = require('path');
class BatchReader {
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
    getBatchBlocks(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.getApi();
            const blockHash = yield api.rpc.chain.getBlockHash(blockNumber);
            const block = yield api.rpc.chain.getBlock(blockHash);
            let blockId = blockNumber;
            let blockArray = [];
            for (const ex of block.block.extrinsics) {
                const { method: { args, method, section } } = ex;
                if (section === "utility" && method === "batch") {
                    const arg = args.toString();
                    const batch = JSON.parse(arg);
                    for (const rmrkObj of batch) {
                        if (rmrkObj.args.hasOwnProperty('_remark')) {
                            blockArray.push(blockId);
                        }
                    }
                }
            }
            return blockArray;
        });
    }
}
exports.BatchReader = BatchReader;
//# sourceMappingURL=BatchReader.js.map