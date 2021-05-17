"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionChecker = void 0;
class VersionChecker {
    constructor(version) {
        this.version = VersionChecker.findVersion(version);
    }
    static findVersion(version) {
        if (version.includes("1.0.0")) {
            return "1.0.0";
        }
        return "";
    }
    checkAssetVersion(data) {
        if (this.version == "1.0.0") {
            return VersionChecker.assetVOne(data);
        }
        else {
            return false;
        }
    }
    checkCollectionVersion(data) {
        if (this.version === "1.0.0") {
            return VersionChecker.collectionVOne(data);
        }
        else {
            return false;
        }
    }
    static collectionVOne(data) {
        return !Number.isNaN(data.max);
    }
    static assetVOne(data) {
        // Remark 1.0.0
        if (data.instance.includes('-')) {
            return false;
        }
        const computed = data.contractId.split('-');
        if (computed.length != 4) {
            return false;
        }
        else {
            if (Number.isNaN(computed[0])) {
                return false;
            }
        }
        return !Number.isNaN(data.sn);
    }
}
exports.VersionChecker = VersionChecker;
//# sourceMappingURL=VersionChecker.js.map