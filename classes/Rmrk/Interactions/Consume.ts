import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";

export class Consume extends Interaction
{

    first = {
        nftName: null,
        nftSn: null,
        collectionName: null,
    };

    second = {
        reason: null,
        collectionName: null,
        nftName: null,
        nftSn: null,
        consumer: null
    };

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, Consume.constructor.name, chain, null);
    }


    public createConsume(){

        const consume = this.rmrkToArray();
        let message;
        console.log(consume);
        if(consume[1].toLowerCase() === "consume"){
            message = this.firstMessage(consume);
        }else{
            message = this.secondMessage(consume);
        }

        return message;
    }


    private firstMessage(consume){

        this.version = consume[2];

        const nftDatas = this.checkDatasLength(consume[3].split('-'), 3);

        this.first.collectionName = nftDatas[0];
        this.first.nftName = nftDatas[1];
        this.first.nftSn = nftDatas[2];

        return this;
    }


    private secondMessage(consume){

        const datas = this.checkDatasLength(consume[2].split('-'), 3);

        this.second.reason = consume[1];
        this.second.collectionName = datas[0];
        this.second.nftName = datas[1];
        this.second.nftSn = datas[2];

        const consumer = this.chain.getAddressClass();
        consumer.address = consume[3];
        this.second.consumer = consumer;

        return this;
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