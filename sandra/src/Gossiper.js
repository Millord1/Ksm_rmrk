var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Gossiper = /** @class */ (function () {
    function Gossiper(entityFactory, updateOnReference) {
        this.showAllTriplets = false;
        this.entityFactory = entityFactory;
        this.updateOnReference = updateOnReference;
        this.joinFactoryGossip = [];
    }
    Gossiper.prototype.exposeGossip = function () {
        var e_1, _a, e_2, _b;
        var _this = this;
        var how = this.entityFactory.refMap;
        var refMap = {};
        try {
            //Iterate over map entries
            for (var how_1 = __values(how), how_1_1 = how_1.next(); !how_1_1.done; how_1_1 = how_1.next()) {
                var _c = __read(how_1_1.value, 2), key = _c[0], value = _c[1];
                refMap[key] = value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (how_1_1 && !how_1_1.done && (_a = how_1.return)) _a.call(how_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // @ts-ignore
            for (var _d = __values(this.entityFactory.refMap.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var entry = _e.value;
                // refMap[entry[0]] = entry[1];
                //console.log(entry);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
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
        var e_3, _a;
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
        try {
            for (var _b = __values(entity.subjectConcept.triplets), _c = _b.next(); !_c.done; _c = _b.next()) {
                var triplet = _c.value;
                _loop_1(triplet);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return myData;
    };
    Gossiper.prototype.joinFactoryGossiper = function (gossiper) {
        this.joinFactoryGossip.push(gossiper);
    };
    return Gossiper;
}());
export { Gossiper };
