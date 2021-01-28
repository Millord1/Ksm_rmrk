"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Reference_js_1 = require("./Reference.js");
//does this move to the other branche ?
class Entity {
    constructor(factory, references = []) {
        this.referenceArray = [];
        this.brotherEntityMap = new Map();
        this.id = 0;
        factory.sandraManager.registerNewEntity(this);
        this.subjectConcept = factory.sandraManager.get('entity:subject:' + this.id);
        references.forEach(ref => {
            this.addReference(ref);
        });
        factory.addEntity(this);
        this.factory = factory;
    }
    addReference(ref) {
        this.referenceArray.push(ref);
        return this;
    }
    getRefValue(concept) {
        const foundConcept = this.factory.sandraManager.somethingToConcept(concept);
        const ref = this.referenceArray.find(ref => ref.concept == foundConcept);
        return ref ? ref.value : '';
    }
    createOrUpdateRef(concept, value) {
        const foundConcept = this.factory.sandraManager.somethingToConcept(concept);
        let ref = this.referenceArray.find(ref => ref.concept == foundConcept);
        if (typeof ref === undefined) {
            // @ts-ignore
            ref = new Reference_js_1.Reference(foundConcept, value);
            this.addReference(ref);
        }
        // @ts-ignore
        ref.value = value;
        return ref;
    }
    joinEntity(verb, entity, sandraManager, refArray) {
        this.subjectConcept.setTriplet(sandraManager.get(verb), entity.subjectConcept, false, refArray);
        this.factory.joinFactory(entity.factory, verb);
    }
    setTriplet(verb, target, sandraManager, refArray) {
        this.subjectConcept.setTriplet(sandraManager.get(verb), sandraManager.get(target), false, refArray);
    }
    setPureShortnameTriplet(verb, target, sandraManager, refArray) {
        this.subjectConcept.setTriplet(sandraManager.get(verb), sandraManager.get(target), true, refArray);
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map