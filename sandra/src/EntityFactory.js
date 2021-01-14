"use strict";
exports.__esModule = true;
exports.EntityFactory = void 0;
var EntityFactory = /** @class */ (function () {
    function EntityFactory(isa, containedIn, sandraManager, updateOnExistingRef) {
        this.entityArray = [];
        this.storage = '';
        this.refMap = new Map();
        this.entityByRevValMap = new Map();
        this.joinedFactory = [];
        this.is_a = isa;
        this.contained_in_file = containedIn;
        this.sandraManager = sandraManager;
        if (updateOnExistingRef != null) {
            updateOnExistingRef = sandraManager.get('null_concept');
        }
        this.updateOnExistingRef = updateOnExistingRef;
    }
    EntityFactory.prototype.addEntity = function (entity) {
        var _this = this;
        this.entityArray.push(entity);
        var factory = this;
        entity.referenceArray.forEach(function (element) {
            factory.sandraManager.registerNewReference(element);
            factory.refMap.set(element.concept.unid, element.concept.shortname);
            var refMapByConcept;
            console.log();
            if (!_this.entityByRevValMap.has(element.concept)) {
                refMapByConcept = new Map();
                _this.entityByRevValMap.set(element.concept, refMapByConcept);
            }
            else {
                refMapByConcept = _this.entityByRevValMap.get(element.concept);
            }
            console.log(refMapByConcept);
            if (refMapByConcept.has(element.value)) {
                var existingElement = refMapByConcept.get(element.value);
                existingElement.push(entity);
            }
            else {
                refMapByConcept.set(element.value, [entity]);
            }
        });
    };
    EntityFactory.prototype.joinFactory = function (entityFactory, onVerb) {
        if (this.joinedFactory.find(function (e) { return e.onVerb === onVerb; }))
            return;
        var createOnRef = entityFactory.updateOnExistingRef;
        this.joinedFactory.push({ entityFactory: entityFactory, onVerb: onVerb, createOnRef: createOnRef });
    };
    return EntityFactory;
}());
exports.EntityFactory = EntityFactory;
//# sourceMappingURL=EntityFactory.js.map