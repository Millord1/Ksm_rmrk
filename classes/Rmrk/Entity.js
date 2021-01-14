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
import { Remark } from "./Remark.js";
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity(rmrk, standard, chain, version, signer) {
        var _this = _super.call(this, version, rmrk, chain, signer) || this;
        _this.toJsonSerialize = function () { return ({
            version: _this.version,
            rmrk: _this.rmrk,
            chain: _this.chain,
            standard: _this.standard
        }); };
        _this.standard = standard;
        return _this;
    }
    Entity.dataTreatment = function (splitted, obj) {
        splitted.forEach(function (index) {
            var datas = index.split(':');
            for (var i = 0; i < datas.length; i++) {
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }
            if (datas[0] === "metadata") {
                var ipfs = datas[2].slice(0, 4);
                if (datas[1] === "ipfs") {
                    var url = datas[2].slice(4);
                    datas[2] = (ipfs === "ipfs") ? ipfs + '/' + url : ipfs + url;
                }
                var separator = (ipfs === "ipfs") ? '://' : ':';
                datas[1] = datas[1] + separator + datas[2];
            }
            // @ts-ignore
            obj[datas[0]] = datas[1];
        });
        return obj;
    };
    return Entity;
}(Remark));
export { Entity };
