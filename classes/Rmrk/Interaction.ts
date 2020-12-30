import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";
import {Nft} from "../Nft";


export abstract class Interaction extends Remark
{

    interaction;

    protected constructor(rmrk: string, interaction:string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.interaction = interaction
    }


    public rmrkToArray(){
        return this.rmrk.split('::');
    }


    public nftFromComputedId(computed){

        const nftDatas = this.checkDatasLength(computed.split('-'), 3);

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
            datas.unshift(name);
        }
        return datas;
    }

}