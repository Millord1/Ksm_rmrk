import {ApiPromise, WsProvider} from '@polkadot/api';
import {hexToString} from "@polkadot/util";
import {Collection} from "../classes/Collection";
import {Kusama} from "../classes/Blockchains/Kusama";
import {Address} from "../classes/Address";

// KSM address
const MILLORD = 'GeZVQ6R7mSZUZxBqq5PDUXrx64KXroVDwqjmAjaeXdF54Xd';
const OBXIUM = 'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby';

class getDatas{

    addr: string;
    wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
    api;

    constructor(addr: string) {
        this.addr = addr;
        this.getApi();
    }

    private async getApi(){

        let myApi;

        if (typeof this.api === 'undefined'){
            myApi = await ApiPromise.create({ provider: this.wsProvider });
        }else{
            myApi = this.api;
        }

        return myApi;
    }


    public async basicDatas(){

        const api = await this.getApi();

        console.log(`Genesis hash #${api.genesisHash.toHex()}`);
        api.rpc.chain.subscribeNewHeads((header) => {
            console.log(`Chain is at #${header.number}`);
        });
    }

    public async balance(){

        const api = await this.getApi();

        // @ts-ignore
        const { nonce, data: balance } = await api.query.system.account(this.addr);
        console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
    }


    public async allAccountDatas(){

        const api = await this.getApi();

        // @ts-ignore
        const datas = await api.query.system.account(this.addr);
        console.log(datas);
    }


    public async testRmrk(){

        const api = await this.getApi();

        const rmrk = api.rpc.system.remark;

        console.log(rmrk);

    }



    public async getRmrks(blockNumber: number){

        const api = await this.getApi();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const block = await api.rpc.chain.getBlock(blockHash);

        const blockRmrks = [];

        block.block.extrinsics.forEach((ex) => {

            const { method: {
                args, method, section
            }} = ex;

            if(section === "system" && method === "remark"){

                const remark = args.toString();

                if(remark.indexOf("") === 0){

                    const uri = hexToString(remark);
                    let lisibleUri = decodeURIComponent(uri);
                    console.log(lisibleUri);

                    // lisibleUri = lisibleUri.substring(12);
                    lisibleUri = lisibleUri.replace(/[&\/\\{}]/g, '');

                    const myCollection = this.rmrkToCollection(lisibleUri);

                    blockRmrks.push({
                        block : blockNumber,
                        Rmrk : lisibleUri,
                        collection : myCollection
                    });
                }
            }

        })
        console.log(blockRmrks);
        return blockRmrks;
    }


    public async nft(blockNum: number){

        const api = await this.getApi();

        const blockHash = await api.rpc.chain.getBlockHash(blockNum);
        const block = await api.rpc.chain.getBlock(blockHash);

        for (const ex of block.block.extrinsics){

            const { method : { args, method, section } } = ex;

            // console.log(ex);

            // if (section === 'nft' && method === 'transfer'){
                let { Owner } = await api.query.nft.nftItemList(args[1], args[2]);
                console.log(Owner);
            // }
        }

    }



    public rmrkToCollection(rmrk: string){

        const splitted = rmrk.split(',');

        const obj = {
            version: "",
            name: "",
            max: 0,
            symbol: "",
            id: "",
            metadata: "",
            issuer: ""
        };

        splitted.forEach((index) => {

            const datas = index.split(':');

            for(let i = 0; i < datas.length; i++){
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }

            if(datas[0] != "metadata"){
                obj[datas[0]] = datas[1];
            }else{
                obj[datas[0]] = datas[2];
            }

        })

        const kusama = new Kusama();
        const collection = new Collection();

        collection.version = obj.version;
        collection.name = obj.name;
        collection.max = obj.max;
        collection.symbol = obj.symbol;
        collection.id = obj.id;
        collection.metadata = obj.metadata;
        collection.blockchain = kusama;
        collection.issuer = new Address(obj.issuer, kusama);

        return collection;
    }


}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const myAddr = new getDatas(OBXIUM);
// myAddr.balance();
// myAddr.basicDatas();
// myAddr.allAccountDatas();

// myAddr.getRmrks(getRandomInt(5432266))
// myAddr.getRmrks(5445689);
myAddr.getRmrks(5445790);

// myAddr.nft(2702139);