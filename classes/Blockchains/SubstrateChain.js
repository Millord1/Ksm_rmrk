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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { Blockchain } from "./Blockchain";
import { Polkadot } from "./Polkadot";
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
        var e_1, _a, e_2, _b;
        if (this.isSubstrate) {
            var chains = fs.readFileSync(path.resolve(__dirname, "substrates.json"));
            var blockchains = JSON.parse(chains);
            try {
                for (var _c = __values(Object.entries(blockchains)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), blockchain = _e[0], substrates = _e[1];
                    try {
                        // @ts-ignore
                        for (var substrates_1 = (e_2 = void 0, __values(substrates)), substrates_1_1 = substrates_1.next(); !substrates_1_1.done; substrates_1_1 = substrates_1.next()) {
                            var substrate = substrates_1_1.value;
                            if (substrate.name === this.name) {
                                this.substrateOf = this.getClassFromString(blockchain);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (substrates_1_1 && !substrates_1_1.done && (_b = substrates_1.return)) _b.call(substrates_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    SubstrateChain.prototype.getClassFromString = function (name) {
        name = name.toLowerCase();
        switch (name) {
            case 'polkadot':
                return new Polkadot();
        }
    };
    return SubstrateChain;
}(Blockchain));
export { SubstrateChain };
