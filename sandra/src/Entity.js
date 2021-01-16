"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
//does this move to the other branche ?
class Entity {
    constructor(factory, references = []) {
        this.referenceArray = [];
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
    joinEntity(verb, entity, sandraManager) {
        this.subjectConcept.setTriplet(sandraManager.get(verb), entity.subjectConcept);
        this.factory.joinFactory(entity.factory, verb);
    }
    setTriplet(verb, target, sandraManager) {
        this.subjectConcept.setTriplet(sandraManager.get(verb), sandraManager.get(target));
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map