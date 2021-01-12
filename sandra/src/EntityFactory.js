var EntityFactory = /** @class */ (function () {
    function EntityFactory(isa, containedIn, sandraManager) {
        this.entityArray = [];
        this.storage = '';
        this.refMap = new Map();
        this.joinedFactory = [];
        this.is_a = isa;
        this.contained_in_file = containedIn;
        this.sandraManager = sandraManager;
    }
    EntityFactory.prototype.addEntity = function (entity) {
        this.entityArray.push(entity);
        var factory = this;
        entity.referenceArray.forEach(function (element) {
            factory.sandraManager.registerNewReference(element);
            factory.refMap.set(element.concept.unid, element.concept.shortname);
        });
    };
    EntityFactory.prototype.joinFactory = function (entityFactory, onVerb, createOnRef) {
        if (createOnRef === void 0) { createOnRef = this.sandraManager.get('null_concept'); }
        this.joinedFactory.push({ entityFactory: entityFactory, onVerb: onVerb, createOnRef: createOnRef });
    };
    return EntityFactory;
}());
export { EntityFactory };
