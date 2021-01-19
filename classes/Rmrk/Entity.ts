import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {publicEntity} from "../Interfaces.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


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

            splittedDatas.forEach((split) => {

                const datas = split.split(':');

                if(datas[0] === "metadata"){

                    const ipfs = datas[2].slice(0, 4);

                    if(datas[1] === "ipfs") {

                        const url = datas[2].slice(4);

                        datas[2] = (ipfs === "ipfs") ? ipfs + '/' + url : ipfs + url;
                    }

                    datas[1] = datas[2];
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            })
        })

        return obj;
    }


    protected getMetadatasContent(){

        // TODO complete with real ipfs metadatas link

        // const url = "ipfs.io/ipfs/QmSkmCWNBoMGyd1d1TzQpgAakRCux5JAqQpRjDSNiv3DDB";
        const url = "ipfs.io/ipfs/QmcQpkNDoYbFPbwPUAaS2ACnKpBib1z6VWDGD1qFtYvfdZ";

        const get = new XMLHttpRequest();

        get.open("GET", 'https://' + url);
        const response = get.response;
        // const jason = JSON.parse(response);

        console.log(response);

        // this.getIpfsMetaDatas(ipfs);
    }

}