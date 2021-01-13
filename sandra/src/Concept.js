var Concept = /** @class */ (function () {
    function Concept(unid, shortname) {
        this.unid = unid;
        this.shortname = shortname;
        this.triplets = new Map();
    }
    Concept.prototype.setTriplet = function (verb, target) {
        if (this.triplets.get(verb)) {
            // @ts-ignore
            this.triplets.get(verb).push(target);
        }
        else {
            this.triplets.set(verb, [target]);
        }
    };
    return Concept;
}());
export { Concept };
