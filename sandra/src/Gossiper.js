"use strict";
exports.__esModule = true;
exports.Gossiper = void 0;
var Gossiper = /** @class */ (function () {
    function Gossiper(entityFactory, updateOnReference) {
        this.showAllTriplets = false;
        this.entityFactory = entityFactory;
        this.updateOnReference = updateOnReference;
        this.joinFactoryGossip = [];
    }
    Gossiper.prototype.exposeGossip = function () {
        var _this = this;
        var how = this.entityFactory.refMap;
        var refMap = {};
        //Iterate over map entries
        // @ts-ignore
        for (var _i = 0, how_1 = how; _i < how_1.length; _i++) {
            var _a = how_1[_i], key = _a[0], value = _a[1];
            refMap[key] = value;
        }
        // @ts-ignore
        for (var _b = 0, _c = this.entityFactory.refMap.entries(); _b < _c.length; _b++) {
            var entry = _c[_b];
            // refMap[entry[0]] = entry[1];
            //console.log(entry);
        }
        var joinedFactoryGossip = [];
        this.entityFactory.joinedFactory.forEach(function (joinFactory) {
            if (joinFactory.entityFactory !== _this.entityFactory) {
                var joinedGossip = new Gossiper(joinFactory.entityFactory, joinFactory.createOnRef);
                joinedFactoryGossip.push(joinedGossip.exposeGossip());
            }
        });
        var entityArray = [];
        this.entityFactory.entityArray.forEach(function (r) {
            entityArray.push(_this.gossipEntity(r));
        });
        var myData = {
            gossiper: {
                updateOnReferenceShortname: this.updateOnReference.shortname
            },
            'entityFactory': {
                'is_a': this.entityFactory.is_a,
                'contained_in_file': this.entityFactory.contained_in_file,
                'entityArray': entityArray,
                'refMap': refMap,
                'joinedFactory': joinedFactoryGossip
            }
        };
        return myData;
    };
    Gossiper.gossipFactory = function (entityFactory, updateOnRefrenceConcept) {
        return new Gossiper(entityFactory, updateOnRefrenceConcept);
    };
    Gossiper.prototype.gossipEntity = function (entity) {
        var myData = {
            id: entity.id,
            subjectUnid: entity.subjectConcept.unid,
            referenceArray: entity.referenceArray
        };
        var _loop_1 = function (triplet) {
            if (!myData.triplets)
                myData.triplets = {};
            if (!myData.triplets[triplet[0].shortname])
                myData.triplets[triplet[0].shortname] = [];
            triplet[1].forEach(function (element) {
                myData.triplets[triplet[0].shortname].push(element.unid);
            });
        };
        // @ts-ignore
        for (var _i = 0, _a = entity.subjectConcept.triplets; _i < _a.length; _i++) {
            var triplet = _a[_i];
            _loop_1(triplet);
        }
        return myData;
    };
    Gossiper.prototype.joinFactoryGossiper = function (gossiper) {
        this.joinFactoryGossip.push(gossiper);
    };
    return Gossiper;
}());
exports.Gossiper = Gossiper;
//# sourceMappingURL=Gossiper.js.map