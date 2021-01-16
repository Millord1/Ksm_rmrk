"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concept = void 0;
class Concept {
    constructor(unid, shortname) {
        this.isPureShortname = false;
        this.unid = unid;
        this.shortname = shortname;
        this.triplets = new Map();
    }
    setTriplet(verb, target, notEntity = false) {
        if (this.triplets.get(verb)) {
            // @ts-ignore
            this.triplets.get(verb).push(target);
        }
        else {
            this.triplets.set(verb, [target]);
        }
        if (notEntity)
            this.isPureShortname = true;
    }
}
exports.Concept = Concept;
//# sourceMappingURL=Concept.js.map