"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Entity = void 0;
var Remark_1 = require("./Remark");
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity(rmrk, standard, chain, version) {
        var _this = _super.call(this, version, rmrk, chain) || this;
        _this.toJsonSerialize = function () { return ({
            version: _this.version,
            rmrk: _this.rmrk,
            chain: _this.chain,
            standard: _this.standard
        }); };
        _this.standard = standard;
        return _this;
    }
    return Entity;
}(Remark_1.Remark));
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map