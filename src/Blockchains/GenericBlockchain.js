"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericBlockchain = void 0;
const Blockchain_1 = require("./Blockchain");
const Jetski_1 = require("../Jetski/Jetski");
class GenericBlockchain extends Blockchain_1.Blockchain {
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
                if (section === "nft") {
                    if (args) {
                        console.log(args.toString());
                    }
                    else {
                        console.log(block.block.extrinsics);
                    }
                    console.log(method);
                    console.log(blockId);
                    process.exit();
                }
                else {
                    resolve([]);
                }
            }
        });
    }
    async sendGossip(canonizeManager, block, blockchain) {
        return new Promise(async (resolve, reject) => {
            resolve("nft send");
        });
    }
}
exports.GenericBlockchain = GenericBlockchain;
//# sourceMappingURL=GenericBlockchain.js.map