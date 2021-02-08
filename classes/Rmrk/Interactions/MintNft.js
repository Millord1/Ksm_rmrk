"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Asset_js_1 = require("../../Asset.js");
class MintNft extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction, meta) {
        super(rmrk, MintNft.name, chain, null, transaction);
        const splitted = this.rmrkToArray();
        // Hack for old rmrk
        const isCorrectVersion = this.versionVerifier(splitted[2]);
        if (isCorrectVersion) {
            this.version = splitted[2];
        }
        else {
            this.version = '0.1';
        }
        this.nft = Asset_js_1.Asset.createNftFromInteraction(rmrk, chain, transaction, meta);
    }
    // Hack for old rmrk
    // TODO Delete this when useless
    versionVerifier(version) {
        const acceptedVersions = [
            'RMRK0.1',
            '0.1',
            '1.0.0'
        ];
        acceptedVersions.forEach((v) => {
            if (version === v) {
                return true;
            }
        });
        return false;
    }
    toJson() {
        const json = this.nft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map