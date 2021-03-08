import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {PublicEntity, EntityInterface} from "../Interfaces.js";
import {Transaction} from "../Transaction.js";
import {Metadata} from "../Metadata.js";

const slugify = require('slugify');


export abstract class Entity extends Remark implements PublicEntity
{

    public standard: string;
    public metaDataContent : Metadata|null;


    protected constructor(rmrk: string, standard: string, chain: Blockchain, version: string|null, transaction:Transaction, meta: Metadata|null) {
        super(version, rmrk, chain, transaction);
        this.standard = standard;
        this.metaDataContent = meta

    }


    toJsonSerialize = () : PublicEntity => ({
        version: this.version,
        rmrk: this.rmrk,
        chain: this.chain,
        standard: this.standard
    })


    public static dataTreatment(splitted: Array <string>, obj: EntityInterface): EntityInterface{

        splitted.forEach((index) => {

            const splittedDatas = index.split(',');

            for(let i = 0; i < splittedDatas.length; i ++){
                splittedDatas[i] = splittedDatas[i].replace(/[&\/\\"']/g, '');
            }

            splittedDatas.forEach((split) => {

                const datas = split.split(':');

                if(datas[0] === "metadata"){

                    const protocol = datas[2].slice(0, 4);

                    if(datas[1] === "ipfs") {

                        if(protocol === "ipfs"){
                            datas[2] = Entity.slugification(datas[2].slice(4));
                        }else{
                            datas[2] = datas[2];
                        }

                    }
                    datas[1] = datas[2];

                }else if(typeof datas[1] === 'string'){
                    datas[1] = Entity.slugification(datas[1]);
                }

                // @ts-ignore
                obj[datas[0]] = datas[1];
            })
        })
        return obj;
    }



    public static slugification(stringToScan: string): string{

        // let isUnicode: boolean = false;
        //
        // for(let i = 0; i<stringToScan.length; i++){
        //     isUnicode = stringToScan.charCodeAt(i) > 255;
        // }

        return slugify(stringToScan, {replacement: ' '});
    }


}