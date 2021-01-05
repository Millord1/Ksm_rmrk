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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var api_1 = require("@polkadot/api");
var util_1 = require("@polkadot/util");
var Kusama_1 = require("../classes/Blockchains/Kusama");
var RmrkReader_1 = require("./RmrkReader");
var fs = require('fs');
var path = require('path');
var ScanBlock = /** @class */ (function () {
    function ScanBlock(chain) {
        this.toHide = [
            'defaultVersion',
            'nft',
            'collection'
        ];
        this.chain = chain;
        this.wsProvider = new api_1.WsProvider(this.chain.wsProvider);
    }
    ScanBlock.prototype.getApi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myApi;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof this.api === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, api_1.ApiPromise.create({ provider: this.wsProvider })];
                    case 1:
                        myApi = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        myApi = this.api;
                        _a.label = 3;
                    case 3: return [2 /*return*/, myApi];
                }
            });
        });
    };
    ScanBlock.prototype.getRmrks = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var api, blockHash, block, blockRmrks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getApi()];
                    case 1:
                        api = _a.sent();
                        return [4 /*yield*/, api.rpc.chain.getBlockHash(blockNumber)];
                    case 2:
                        blockHash = _a.sent();
                        return [4 /*yield*/, api.rpc.chain.getBlock(blockHash)];
                    case 3:
                        block = _a.sent();
                        blockRmrks = [];
                        blockRmrks.push({ block: blockNumber });
                        block.block.extrinsics.forEach(function (ex) {
                            // TODO find signer
                            var _a = ex.method, args = _a.args, method = _a.method, section = _a.section;
                            if (section === "system" && method === "remark") {
                                var remark = args.toString();
                                if (remark.indexOf("") === 0) {
                                    // const remrk = '0x7b2276657273696f6e223a2022524d524b302e31222c226e616d65223a22446f74204c656170204561726c792050726f6d6f74657273222c226d6178223a3130302c22697373756572223a2243706a734c4443314a467972686d3366744339477334516f79726b484b685a4b744b37597147545246745461666770222c2273796d626f6c223a22444c4550222c226964223a2022306166663638363562656433613636622d444c4550222c226d65746164617461223a22697066733a2f2f697066732f516d5667733850346177685a704658686b6b676e437742703441644b526a3346394b35386d435a366678766e336a227d';
                                    // const uri = hexToString(remrk);
                                    var uri = util_1.hexToString(remark);
                                    var lisibleUri = decodeURIComponent(uri);
                                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');
                                    var reader = new RmrkReader_1.RmrkReader(_this.chain);
                                    var rmrkReader = reader.readRmrk(lisibleUri);
                                    var jason = JSON.stringify(rmrkReader);
                                    fs.writeFileSync(path.resolve(__dirname, "testJson.json"), jason);
                                    // console.log(jason);
                                    blockRmrks.push({
                                        rmrk: rmrkReader,
                                    });
                                }
                            }
                        });
                        console.log(blockRmrks);
                        return [2 /*return*/, blockRmrks];
                }
            });
        });
    };
    return ScanBlock;
}());
var scan = new ScanBlock(new Kusama_1.Kusama());
// const scan = new ScanBlock(new Polkadot());
// FAIL
// scan.getRmrks(5445790);
// Human Json (file)
// scan.getRmrks(5445790);
//Send
// scan.getRmrks(5437975);
// MintNft
// scan.getRmrks(5420541);
// Mint
// scan.getRmrks(5083411);
scan.getRmrks(4960562);
//# sourceMappingURL=ScanBlock.js.map