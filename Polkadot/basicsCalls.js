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
// KSM address
var MILLORD = 'GeZVQ6R7mSZUZxBqq5PDUXrx64KXroVDwqjmAjaeXdF54Xd';
var getDatas = /** @class */ (function () {
    function getDatas(addr) {
        this.wsProvider = new api_1.WsProvider('wss://kusama-rpc.polkadot.io/');
        this.addr = addr;
        this.getApi();
    }
    getDatas.prototype.getApi = function () {
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
    getDatas.prototype.basicDatas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var api;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getApi()];
                    case 1:
                        api = _a.sent();
                        console.log("Genesis hash #" + api.genesisHash.toHex());
                        api.rpc.chain.subscribeNewHeads(function (header) {
                            console.log("Chain is at #" + header.number);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    getDatas.prototype.balance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var api, _a, nonce, balance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getApi()];
                    case 1:
                        api = _b.sent();
                        return [4 /*yield*/, api.query.system.account(this.addr)];
                    case 2:
                        _a = _b.sent(), nonce = _a.nonce, balance = _a.data;
                        console.log("balance of " + balance.free + " and a nonce of " + nonce);
                        return [2 /*return*/];
                }
            });
        });
    };
    getDatas.prototype.allAccountDatas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var api, datas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getApi()];
                    case 1:
                        api = _a.sent();
                        return [4 /*yield*/, api.query.system.account(this.addr)];
                    case 2:
                        datas = _a.sent();
                        console.log(datas);
                        return [2 /*return*/];
                }
            });
        });
    };
    getDatas.prototype.getRmrks = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var api, blockHash, block, blockRmrks;
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
                        block.block.extrinsics.forEach(function (ex) {
                            var _a = ex.method, args = _a.args, method = _a.method, section = _a.section;
                            if (section === "system" && method === "remark") {
                                var remark = args.toString();
                                if (remark.indexOf("") === 0) {
                                    blockRmrks.push(remark);
                                }
                            }
                        });
                        console.log(blockRmrks);
                        return [2 /*return*/];
                }
            });
        });
    };
    return getDatas;
}());
function getRandomInt(max) {
    var number = Math.floor(Math.random() * Math.floor(max));
    console.log("Block #" + number);
    return number;
}
var myAddr = new getDatas(MILLORD);
// myAddr.balance();
// myAddr.basicDatas();
// myAddr.allAccountDatas();
// myAddr.getRmrks(getRandomInt(5432266))
myAddr.getRmrks(4892957);
//# sourceMappingURL=basicsCalls.js.map