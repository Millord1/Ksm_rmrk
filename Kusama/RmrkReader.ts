import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Nft} from "../classes/Nft";
import {Collection} from "../classes/Collection";


export class RmrkReader
{

    obj = {
        version: null,
        name: null,
        max: null,
        symbol: null,
        id: null,
        metadata: null,
        issuer: null,
        transferable: null,
        sn: null,
        collection: null
    }

    chain;

    constructor(chain: Blockchain){
        this.chain = chain;
    }

    public readRmrk(rmrk: string){

        const firstChars = rmrk.substring(0, 4);

        if(firstChars.toLowerCase() === 'rmrk'){
            this.readInteraction(rmrk);
        }else{
            this.readEntity(rmrk);
        }

    }


    public readEntity(rmrk: string){

        const splitted = rmrk.split(',');

        splitted.forEach((index) => {

            const datas = index.split(':');

            for(let i = 0; i < datas.length; i++){
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }

            this.obj[datas[0]] = datas[1];
        })

        const myClass = (this.obj.id === null) ? new Nft(rmrk, this.chain) : new Collection(rmrk, this.chain);

        return myClass.rmrkToObject(this.obj);
    }



    public readInteraction(rmrk: string){

    }

}