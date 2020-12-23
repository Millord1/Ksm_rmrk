"use strict";
exports.__esModule = true;
exports.Rmrk = void 0;
var Collection_1 = require("./Collection");
var Nft_1 = require("./Nft");
var KusamaAddress_1 = require("./Addresses/KusamaAddress");
var Rmrk = /** @class */ (function () {
    function Rmrk(rmrk, chain) {
        this.obj = {
            version: null,
            name: null,
            max: null,
            symbol: null,
            id: null,
            metadata: null,
            issuer: null,
            transferable: null,
            sn: null,
            collection: null
        };
        this.rmrk = rmrk;
        this.chain = chain;
    }
    Rmrk.prototype.scanRmrk = function () {
        var _this = this;
        var splitted = this.rmrk.split(',');
        splitted.forEach(function (index) {
            var datas = index.split(':');
            for (var i = 0; i < datas.length; i++) {
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }
            // if(datas[0] != "metadata"){
            //     this.obj[datas[0]] = datas[1];
            // }else{
            //     this.obj[datas[0]] = datas[2];
            // }
            _this.obj[datas[0]] = datas[1];
        });
        if (this.obj.id === null) {
            return this.rmrkToNft();
        }
        else {
            return this.rmrkToCollection();
        }
    };
    Rmrk.prototype.rmrkToNft = function () {
        var obj = this.obj;
        var nft = new Nft_1.Nft();
        nft.collection = obj.collection;
        nft.name = obj.name;
        nft.transferable = obj.transferable;
        nft.sn = obj.sn;
        nft.metadata = obj.metadata;
        nft.issuer = (obj.issuer === null) ? null : new KusamaAddress_1.KusamaAddress(obj.issuer);
        // nft.issuer = this.chain.getAddressClass(obj.issuer);
        nft.blockchain = this.chain;
        return nft;
    };
    Rmrk.prototype.rmrkToCollection = function () {
        var obj = this.obj;
        var collection = new Collection_1.Collection();
        collection.version = obj.version;
        collection.name = obj.name;
        collection.max = obj.max;
        collection.symbol = obj.symbol;
        collection.id = obj.id;
        collection.metadata = obj.metadata;
        collection.blockchain = this.chain;
        collection.issuer = (obj.issuer === null) ? null : new KusamaAddress_1.KusamaAddress(obj.issuer);
        // collection.issuer = new KusamaAddress(obj.issuer);
        return collection;
    };
    return Rmrk;
}());
exports.Rmrk = Rmrk;
//# sourceMappingURL=Rmrk.js.map