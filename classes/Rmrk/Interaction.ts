import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";
import {Nft} from "../Nft";


export abstract class Interaction extends Remark
{

    interaction: string;

    protected constructor(rmrk: string, interaction:string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.interaction = interaction
    }


    public rmrkToArray(){
        return this.rmrk.split('::');
    }


    public nftFromComputedId(computed){

        let nftDatas = this.checkDatasLength(computed.split('-'), 3);

        this.nft.collection = nftDatas[0];
        this.nft.name = nftDatas[1];
        this.nft.sn = nftDatas[2];

        const nft = new Nft(this.rmrk, this.chain, this.version);
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

}