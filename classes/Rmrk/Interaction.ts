import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {Asset} from "../Asset.js";
import {publicInteraction} from "../Interfaces.js";
import {Transaction} from "../Transaction.js";


export abstract class Interaction extends Remark implements publicInteraction
{

    interaction: string;

    protected constructor(rmrk: string, interaction:string, chain: Blockchain, version: string|null, transaction: Transaction) {
        super(version, rmrk, chain, transaction);
        this.interaction = interaction
    }


    public rmrkToArray(){
        return this.rmrk.split('::');
    }


    public nftFromComputedId(computed: string){

        let nftDatas = this.checkDatasLength(computed.split('-'), 3);

        // @ts-ignore
        this.nft.collection = nftDatas[0];
        // @ts-ignore
        this.nft.name = nftDatas[1];
        // @ts-ignore
        this.nft.sn = nftDatas[2];


        const nft = new Asset(this.rmrk, this.chain, this.version, this.transaction);
        return nft.rmrkToObject(this.nft);
    }


    private checkDatasLength(datas: Array<string>, length: number){

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

                datas = [];

                datas.unshift(serialN);
                datas.unshift(nftName);
                datas.unshift(name);
            }
        }

        return datas;
    }


    toJsonSerialize = () : publicInteraction => ({
       version : this.version,
       rmrk: this.rmrk,
       // @ts-ignore
       chain: this.chain.toJson(),
       interaction: this.interaction
    });

}