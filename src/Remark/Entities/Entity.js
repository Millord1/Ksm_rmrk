"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Remark_1 = require("../Remark");
const slugify = require('slugify');
class Entity extends Remark_1.Remark {
    constructor(rmrk, chain, url, version) {
        super(rmrk, chain, version);
        this.url = url;
    }
    addMetadata(meta) {
        this.metaData = meta;
    }
    static slugification(toSlugify) {
        return slugify(toSlugify, { replacement: ' ' });
    }
}
exports.Entity = Entity;
Entity.undefinedEntity = "undefined entity";
//# sourceMappingURL=Entity.js.map