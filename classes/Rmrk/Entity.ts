import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";
import {publicEntity} from "../Interfaces";


export abstract class Entity extends Remark implements publicEntity
{

    standard;

    protected constructor(rmrk: string, standard: string, chain: Blockchain, version, signer:string) {
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

            const datas = index.split(':');

            for(let i = 0; i < datas.length; i++){
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }

            if(datas[0] === "metadata"){

                const ipfs = datas[2].slice(0, 4);

                if(datas[1] === "ipfs") {

                    const url = datas[2].slice(4);

                    datas[2] = (ipfs === "ipfs") ? ipfs + '/' + url : ipfs + url;
                }

                const separator = (ipfs === "ipfs") ? '://' : ':';
                datas[1] = datas[1] + separator + datas[2];
            }

            obj[datas[0]] = datas[1];
        })
        return obj;
    }

}