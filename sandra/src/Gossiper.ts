import {EntityFactory} from "./EntityFactory.js";
import {Concept} from "./Concept.js";
import {Entity} from "./Entity";
import {SandraManager} from "./SandraManager.js";
import {Reference} from "./Reference.js";


const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

interface simpleReferenceForDisplay {

    conceptUnid:number,
    value:string

}

export interface ApiConnector {

    gossipUrl:string
    jwt:string


}

export class Gossiper{

    public entityFactory:EntityFactory ;
    public updateOnReference:Concept ;
    public joinFactoryGossip:Gossiper[];
    public showAllTriplets:boolean = false ;


    public constructor(entityFactory:EntityFactory, updateOnReference?:Concept) {

        //taking factory default if not set
        if (!updateOnReference) updateOnReference = entityFactory.updateOnExistingRef ;

        this.entityFactory = entityFactory ;
        this.updateOnReference = updateOnReference ;
        this.joinFactoryGossip = [];

    }

    public exposeGossip(isFinalFactory:boolean = true){

            let how = this.entityFactory.refMap ;

            let refMap:any = {}
            //Iterate over map entries
            // @ts-ignore
        for (let [key, value] of how){

                refMap[key] = value;
            }


            // @ts-ignore
            for (let entry of this.entityFactory.refMap.entries()) {
                // refMap[entry[0]] = entry[1];
                //console.log(entry);

            }

            let joinedFactoryGossip:Array<any> = [] ;

            this.entityFactory.joinedFactory.forEach(joinFactory =>{

                if (joinFactory.entityFactory !== this.entityFactory) {
                    let joinedGossip = new Gossiper(joinFactory.entityFactory, joinFactory.createOnRef);
                    joinedFactoryGossip.push(joinedGossip.exposeGossip(false)) ;


                }

            })

            let entityArray:Array<Entity> = []

                this.entityFactory.entityArray.forEach(r=>{
                    entityArray.push(this.gossipEntity(r))
                })






            let myData:any = {
                gossiper:{
                  updateOnReferenceShortname:this.updateOnReference.shortname,

                },
                'entityFactory': {
                    'is_a': this.entityFactory.is_a,
                    'contained_in_file': this.entityFactory.contained_in_file,
                    'entityArray': entityArray,
                    'refMap': refMap,
                    'joinedFactory':joinedFactoryGossip
                }

            }

        if (isFinalFactory){
            myData.gossiper.shortNameDictionary = this.buildShortNameDictionary(this.entityFactory.sandraManager) ;

        }


            return myData ;
    }


    public static gossipFactory(entityFactory:EntityFactory,updateOnRefrenceConcept:Concept){


        return new Gossiper(entityFactory,updateOnRefrenceConcept);


    }
    public gossipEntity(entity:Entity){

        let myData:any ={

            id:entity.id,
            subjectUnid:entity.subjectConcept.unid,
            referenceArray:entity.referenceArray

        }




        for (let triplet of entity.subjectConcept.triplets) {

            if (!myData.triplets) myData.triplets = {};
            if (!myData.triplets[triplet[0].shortname]) myData.triplets[triplet[0].shortname] = [];

            triplet[1].forEach(element =>{
                myData.triplets[triplet[0].shortname].push(element.unid) ;

            })

        }
        //check triplet references
        for (let tripletRef of entity.subjectConcept.tripletsReferences) {

            if (!myData.tripletsReferences) myData.tripletsReferences = {};
            if (!myData.tripletsReferences[tripletRef[0].shortname]) myData.tripletsReferences[tripletRef[0].shortname] = [];

            //simplyfy reference


            tripletRef[1].forEach(element =>{
                //simplify reference for display
                let simpleReference:simpleReferenceForDisplay[] = this.simplifyReference(element.refs);



                myData.tripletsReferences[tripletRef[0].shortname].push({targetUnid:element.concept.unid,refs:simpleReference}) ;

            })

        }




        return myData ;

    }

    public joinFactoryGossiper(gossiper:Gossiper){

        this.joinFactoryGossip.push(gossiper);

    }

    public buildShortNameDictionary(sandra:SandraManager){

        let dictionnary:any = {};

        sandra.conceptList.forEach(element =>{

            dictionnary[element.unid] = element.shortname ;

        })

        return dictionnary ;


    }

    public simplifyReference(ref:Reference[]):simpleReferenceForDisplay[]{

        let simpleRefArray:simpleReferenceForDisplay[] = []

        ref.forEach(ref =>{
            simpleRefArray.push({conceptUnid:ref.concept.unid,value:ref.value})

        })

        return simpleRefArray ;


    }

    public async gossipToUrl(connector:ApiConnector,flush?:boolean):Promise<any>{



        return new Promise((resolve:any,reject:any) => {
            const xmlhttp = new XMLHttpRequest();
            let flushData = '';
            if (flush) flushData = '&flush=true';

            xmlhttp.open("POST", connector.gossipUrl+'?jwt='+connector.jwt+flushData);
            console.log(connector.gossipUrl+'?jwt='+connector.jwt+flushData);
            xmlhttp.setRequestHeader("Content-Type", "application/json");

            xmlhttp.send(JSON.stringify(this.exposeGossip(true)))
            //console.log(JSON.stringify(this.exposeGossip(true)));


            xmlhttp.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    let response = this.responseText;


                    resolve (response);
                }else if (this.readyState == 4)
                    reject ('Bad request :' + this.status);

            }


        });


    }

    public async flushDatagraph(connector:ApiConnector):Promise<any>{



        return new Promise((resolve:any,reject:any) => {
            const xmlhttp = new XMLHttpRequest();

            let  flushData = '&flush=true';

            xmlhttp.open("POST", connector.gossipUrl+'?jwt='+connector.jwt+flushData);
            console.log(connector.gossipUrl+'?jwt='+connector.jwt+flushData);
            xmlhttp.setRequestHeader("Content-Type", "application/json");

            xmlhttp.send()


            xmlhttp.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    let response = this.responseText;


                    resolve (response);
                }else if (this.readyState == 4)
                    reject ('Bad request :' + this.status);

            }


        });


    }


}