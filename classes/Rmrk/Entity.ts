import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {publicEntity} from "../Interfaces.js";


export abstract class Entity extends Remark implements publicEntity
{

    standard;

    protected constructor(rmrk: string, standard: string, chain: Blockchain, version: string|null, signer:string) {
        super(version, rmrk, chain, signer);
        this.standard = standard;
    }


    toJsonSerialize = () : publicEntity => ({
        version: this.version,
        rmrk: this.rmrk,
        chain: this.chain,
        standard: this.standard
    })


    public static dataTreatment(splitted: Array <string>, obj: Object){

        splitted.forEach((index) => {

            const splittedDatas = index.split(',');

            for(let i = 0; i < splittedDatas.length; i++){
                splittedDatas[i] = splittedDatas[i].replace(/[&\/\\"']/g, '');
            }

            if(splittedDatas.length > 2){

                splittedDatas.forEach((split) => {

                    const datas = split.split(':');

                    if(datas[0] === "metadata"){

                        const ipfs = datas[2].slice(0, 4);

                        if(datas[1] === "ipfs") {

                            const url = datas[2].slice(4);

                            datas[2] = (ipfs === "ipfs") ? ipfs + '/' + url : ipfs + url;
                        }

                        const separator = (ipfs === "ipfs") ? '://' : ':';
                        datas[1] = datas[1] + separator + datas[2];
                    }
                    // @ts-ignore
                    obj[datas[0]] = datas[1];
                })
            }
        })

        return obj;
    }

}