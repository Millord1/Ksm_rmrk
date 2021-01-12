"use strict";
exports.__esModule = true;
exports.Entity = void 0;
var Entity = /** @class */ (function () {
    function Entity(factory, references) {
        var _this = this;
        if (references === void 0) { references = []; }
        this.referenceArray = [];
        this.id = 0;
        factory.sandraManager.registerNewEntity(this);
        this.subjectConcept = factory.sandraManager.get('entity:subject:' + this.id);
        references.forEach(function (ref) {
            _this.addReference(ref);
        });
        factory.addEntity(this);
        // this.factory = factory ;
    }
    Entity.prototype.addReference = function (ref) {
        this.referenceArray.push(ref);
        return this;
    };
    Entity.prototype.joinEntity = function (entity, verb, sandraManager) {
        this.subjectConcept.setTriplet(sandraManager.get(verb), entity.subjectConcept);
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map