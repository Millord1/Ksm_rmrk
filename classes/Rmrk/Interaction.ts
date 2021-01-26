import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {Asset} from "../Asset.js";
import {EntityInterface, PublicInteraction} from "../Interfaces.js";
import {Transaction} from "../Transaction.js";
import {Metadata} from "../Metadata.js";


export abstract class Interaction extends Remark implements PublicInteraction
{

    interaction: string;

    protected constructor(rmrk: string, interaction:string, chain: Blockchain, version: string|null, transaction: Transaction) {
        super(version, rmrk, chain, transaction);
        this.interaction = interaction
    }


    public rmrkToArray(){
        return this.rmrk.split('::');
    }


    public nftFromComputedId(computed: string, meta: Metadata){

        let nftDatas = this.checkDatasLength(computed.split('-'), 3);

        return new Asset(this.rmrk, this.chain, this.version, this.transaction, nftDatas, meta);
    }


    private checkDatasLength(datas: Array<string>, length: number): EntityInterface{

        const obj = Remark.entityObj;

        if(datas.length > length){

            const name = datas[0] + '-' + datas[1];
            datas.splice(0, 2);

            const sn = datas[datas.length -1];

            let isNumber = true;

            for (let i=0; i < sn.length; i++ ){
                if( isNaN(parseInt(sn[i])) ){
                    isNumber = false;
                }
            }

            if(isNumber){

                const serialN = sn;
                datas.pop();

                let nftName = '';

                for (let i=0; i < datas.length; i++){
                    let first = (i === 0) ? '' : '-';
                    nftName += first + datas[i];
                }

                obj.collection = name;
                obj.name = nftName;
                obj.sn = serialN;
            }
        }

        return obj;
    }


    toJsonSerialize = () : PublicInteraction => ({
       version : this.version,
       rmrk: this.rmrk,
       // @ts-ignore
       chain: this.chain.toJson(),
       interaction: this.interaction
    });

}