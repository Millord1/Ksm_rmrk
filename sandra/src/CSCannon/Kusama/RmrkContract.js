"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmrkContract = void 0;
const BlockchainContract_js_1 = require("../BlockchainContract.js");
const Reference_js_1 = require("../../Reference.js");
class RmrkContract extends BlockchainContract_js_1.BlockchainContract {
    constructor(factory, id, sandra, standard = null) {
        super(factory, id, sandra, standard);
        let contractId = [];
        try {
            contractId = this.checkIdIntegrity(id);
        }
        catch (e) {
            console.error(e);
        }
        if (contractId.length > 0) {
            this.addReference(new Reference_js_1.Reference(sandra.get(RmrkContract.BLOCK_ID), contractId[0]));
            this.addReference(new Reference_js_1.Reference(sandra.get(RmrkContract.COLLECTION_ID), contractId[1]));
            this.addReference(new Reference_js_1.Reference(sandra.get(RmrkContract.ASSET_NAME), contractId[2]));
        }
    }
    checkIdIntegrity(id) {
        const idSplit = id.split('-');
        if (idSplit.length != 3) {
            throw 'This contract ID length is uncorrect';
        }
        if (Number.isNaN(idSplit[0])) {
            throw 'Missing block ID in contract ID';
        }
        return idSplit;
    }
}
exports.RmrkContract = RmrkContract;
RmrkContract.BLOCK_ID = "rmrk_block_id";
RmrkContract.COLLECTION_ID = "rmrk_collection_id";
RmrkContract.ASSET_NAME = "rmrk_asset-name";
//# sourceMappingURL=RmrkContract.js.map