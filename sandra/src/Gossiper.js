"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gossiper = void 0;
class Gossiper {
    constructor(entityFactory, updateOnReference) {
        this.showAllTriplets = false;
        this.entityFactory = entityFactory;
        this.updateOnReference = updateOnReference;
        this.joinFactoryGossip = [];
    }
    exposeGossip(isFinalFactory = true) {
        let how = this.entityFactory.refMap;
        let refMap = {};
        //Iterate over map entries
        // @ts-ignore
        for (let [key, value] of how) {
            refMap[key] = value;
        }
        // @ts-ignore
        for (let entry of this.entityFactory.refMap.entries()) {
            // refMap[entry[0]] = entry[1];
            //console.log(entry);
        }
        let joinedFactoryGossip = [];
        this.entityFactory.joinedFactory.forEach(joinFactory => {
            if (joinFactory.entityFactory !== this.entityFactory) {
                let joinedGossip = new Gossiper(joinFactory.entityFactory, joinFactory.createOnRef);
                joinedFactoryGossip.push(joinedGossip.exposeGossip(false));
            }
        });
        let entityArray = [];
        this.entityFactory.entityArray.forEach(r => {
            entityArray.push(this.gossipEntity(r));
        });
        let myData = {
            gossiper: {
                updateOnReferenceShortname: this.updateOnReference.shortname,
            },
            'entityFactory': {
                'is_a': this.entityFactory.is_a,
                'contained_in_file': this.entityFactory.contained_in_file,
                'entityArray': entityArray,
                'refMap': refMap,
                'joinedFactory': joinedFactoryGossip
            }
        };
        if (isFinalFactory) {
            myData.gossiper.shortNameDictionary = this.buildShortNameDictionary(this.entityFactory.sandraManager);
        }
        return myData;
    }
    static gossipFactory(entityFactory, updateOnRefrenceConcept) {
        return new Gossiper(entityFactory, updateOnRefrenceConcept);
    }
    gossipEntity(entity) {
        let myData = {
            id: entity.id,
            subjectUnid: entity.subjectConcept.unid,
            referenceArray: entity.referenceArray
        };
        console.log(entity.subjectConcept.triplets);
        for (let triplet of entity.subjectConcept.triplets) {
            if (!myData.triplets)
                myData.triplets = {};
            if (!myData.triplets[triplet[0].shortname])
                myData.triplets[triplet[0].shortname] = [];
            triplet[1].forEach(element => {
                myData.triplets[triplet[0].shortname].push(element.unid);
            });
        }
        console.log(myData.triplets);
        return myData;
    }
    joinFactoryGossiper(gossiper) {
        this.joinFactoryGossip.push(gossiper);
    }
    buildShortNameDictionary(sandra) {
        let dictionnary = {};
        sandra.conceptList.forEach(element => {
            dictionnary[element.unid] = element.shortname;
        });
        return dictionnary;
    }
}
exports.Gossiper = Gossiper;
//# sourceMappingURL=Gossiper.js.map