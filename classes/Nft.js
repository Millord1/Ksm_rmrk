"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nft = void 0;
const Entity_js_1 = require("./Rmrk/Entity.js");
const BlockchainContract_js_1 = require("./Contract/BlockchainContract.js");
class Nft extends Entity_js_1.Entity {
    constructor(rmrk, chain, version, signer) {
        super(rmrk, Nft.name, chain, version, signer);
    }
    rmrkToObject(obj) {
        if (obj.contract instanceof BlockchainContract_js_1.BlockchainContract) {
            this.contract = obj.collection;
        }
        else {
            this.contractId = obj.collection;
        }
        this.name = obj.name;
        this.transferable = obj.transferable;
        this.sn = obj.sn;
        this.metadata = obj.metadata;
        if (typeof obj.issuer != 'undefined') {
            // @ts-ignore
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }
        return this;
    }
    createNftFromInteraction() {
        const splitted = this.rmrk.split('::');
        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const nftDatas = splitted[2].split(',');
        Entity_js_1.Entity.dataTreatment(nftDatas, this.nft);
        return this.rmrkToObject(this.nft);
    }
    toJson(needStringify = true, needSubstrate = true) {
        const json = this.toJsonSerialize();
        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);
        // @ts-ignore
        json['contractId'] = this.contractId;
        // @ts-ignore
        json['contract'] = this.contract;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['transferable'] = this.transferable;
        // @ts-ignore
        json['sn'] = this.sn;
        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['issuer'] = this.issuer;
        return (needStringify) ? JSON.stringify(json) : json;
    }
}
exports.Nft = Nft;
//# sourceMappingURL=Nft.js.map