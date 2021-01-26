import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {PublicEntity, EntityInterface, MetaDataInputs} from "../Interfaces.js";
import {Transaction} from "../Transaction.js";
import {Metadata} from "../Metadata.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export abstract class Entity extends Remark implements PublicEntity
{

    public standard: string;
    public metaDataContent : Metadata | undefined;
    public url: string;

    protected constructor(rmrk: string, standard: string, chain: Blockchain, version: string|null, transaction:Transaction, url: string) {
        super(version, rmrk, chain, transaction);
        this.standard = standard;
        this.url = url;

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

            for(let i = 0; i < splittedDatas.length; i++){
                splittedDatas[i] = splittedDatas[i].replace(/[&\/\\"']/g, '');
            }

            splittedDatas.forEach((split) => {

                const datas = split.split(':');

                if(datas[0] === "metadata"){

                    const protocol = datas[2].slice(0, 4);

                    if(datas[1] === "ipfs") {

                        const url = datas[2].slice(4);

                        datas[2] = (protocol === "ipfs") ? protocol + '/' + url : protocol + url;
                    }

                    datas[1] = datas[2];
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            })
        })

        return obj;

    }


    // public async getMeta(){
    //     this.metaDataContent = await this.getMetaDataContent(this.url);
    // }



    public static async getMetaDataContent(url: string): Promise<Metadata>{

        return new Promise((resolve) => {

            // const urlToCall = 'ipfs.io/' + url;
            const urlToCall = 'ipfs.io/ipfs/QmavoTVbVHnGEUztnBT2p3rif3qBPeCfyyUE5v4Z7oFvs4';
            const get = new XMLHttpRequest();

            let response: MetaDataInputs;
            let metaData : Metadata;

            get.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    response = JSON.parse(this.responseText);
                    metaData = new Metadata(urlToCall, response);
                    resolve (metaData);
                }
                // else{
                //     const metaObj : MetaDataInputs = {
                //         external_url : "",
                //         image : "",
                //         description : "",
                //         name : "",
                //         attributes : [],
                //         background_color : "",
                //     }
                //     metaData = new Metadata(urlToCall, metaObj);
                //     reject (metaData);
                // }
            }

            get.open("GET", 'https://' + urlToCall);
            get.send();

        });

    }


}