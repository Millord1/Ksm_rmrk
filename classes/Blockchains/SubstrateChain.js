"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SubstrateChain = void 0;
var Blockchain_1 = require("./Blockchain");
var Polkadot_1 = require("./Polkadot");
var fs = require('fs');
var path = require('path');
var SubstrateChain = /** @class */ (function (_super) {
    __extends(SubstrateChain, _super);
    function SubstrateChain(name, symbol, prefix, isSubstrate, addressClass) {
        var _this = _super.call(this, name, symbol, prefix, isSubstrate, addressClass) || this;
        _this.checkSubstrate();
        return _this;
    }
    SubstrateChain.prototype.checkSubstrate = function () {
        if (this.isSubstrate) {
            var chains = fs.readFileSync(path.resolve(__dirname, "substrates.json"));
            var blockchains = JSON.parse(chains);
            for (var _i = 0, _a = Object.entries(blockchains); _i < _a.length; _i++) {
                var _b = _a[_i], blockchain = _b[0], substrates = _b[1];
                // @ts-ignore
                for (var _c = 0, substrates_1 = substrates; _c < substrates_1.length; _c++) {
                    var substrate = substrates_1[_c];
                    if (substrate.name === this.name) {
                        this.substrateOf = this.getClassFromString(blockchain);
                    }
                }
            }
        }
    };
    SubstrateChain.prototype.getClassFromString = function (name) {
        name = name.toLowerCase();
        switch (name) {
            case 'polkadot':
                return new Polkadot_1.Polkadot();
        }
    };
    return SubstrateChain;
}(Blockchain_1.Blockchain));
exports.SubstrateChain = SubstrateChain;
//# sourceMappingURL=SubstrateChain.js.map