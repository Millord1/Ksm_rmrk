"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concept = void 0;
class Concept {
    constructor(unid, shortname) {
        this.isPureShortname = false;
        this.unid = unid;
        this.shortname = shortname;
        this.triplets = new Map();
        this.tripletsReferences = new Map();
    }
    setTriplet(verb, target, notEntity = false, refs) {
        let verbExist = false;
        if (this.triplets.get(verb)) {
            // @ts-ignore
            this.triplets.get(verb).push(target);
            verbExist = true;
        }
        else {
            this.triplets.set(verb, [target]);
            //this.tripletsReferences.set(verb,[target]);
        }
        if (notEntity)
            this.isPureShortname = true;
        if (refs) {
            if (verbExist) {
                // @ts-ignore
                this.tripletsReferences.get(verb).push({ concept: target, refs: refs });
            }
            else {
                this.tripletsReferences.set(verb, [{ concept: target, refs: refs }]);
            }
        }
    }
}
exports.Concept = Concept;
//# sourceMappingURL=Concept.js.map