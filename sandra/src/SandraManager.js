"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandraManager = void 0;
const Concept_js_1 = require("./Concept.js");
class SandraManager {
    constructor() {
        this.invisible = null;
        this.conceptList = [];
        this.entityList = [];
        this.refList = [];
        this.conceptMap = new Map();
        this.entityMap = new Map();
        this.registerNewConcept('null_concept');
    }
    registerNewConcept(shortname) {
        let conceptId = this.conceptList.length;
        let concept = new Concept_js_1.Concept(conceptId, shortname);
        this.conceptMap.set(concept.shortname, concept);
        this.conceptList.push(concept);
        return concept;
    }
    registerNewEntity(entity) {
        entity.id = this.entityList.length;
        this.entityMap.set(entity.id, entity);
        this.entityList.push(entity);
        return entity;
    }
    registerNewReference(ref) {
        ref.refId = this.refList.length;
        this.refList.push(ref);
        return ref;
    }
    get(shortname) {
        if (this.conceptMap.get(shortname))
            return this.conceptMap.get(shortname);
        return this.registerNewConcept(shortname);
    }
    somethingToConcept(something) {
        if (something instanceof Concept_js_1.Concept)
            return something;
        if (typeof something === 'string') {
            return this.get(something);
        }
        if (typeof something === "number") {
            let concept = [...this.conceptMap.values()].filter((item) => item.unid === something);
            return concept[0];
        }
    }
}
exports.SandraManager = SandraManager;
//# sourceMappingURL=SandraManager.js.map