import {Collection} from "./Collection";
import {Nft} from "./Nft";
import {KusamaAddress} from "./Addresses/KusamaAddress";
import {Blockchain} from "./Blockchains/Blockchain";


export class Rmrk
{
    rmrk: string;
    chain: Blockchain;

    private obj = {
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

    constructor(rmrk: string, chain){
        this.rmrk = rmrk;
        this.chain = chain;
    }

    public scanRmrk(){

        const splitted = this.rmrk.split(',');

        splitted.forEach((index) => {

            const datas = index.split(':');

            for(let i = 0; i < datas.length; i++){
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }

            // if(datas[0] != "metadata"){
            //     this.obj[datas[0]] = datas[1];
            // }else{
            //     this.obj[datas[0]] = datas[2];
            // }

            this.obj[datas[0]] = datas[1];


        })

        if( this.obj.id === null ){
            return this.rmrkToNft();
        }else{
            return this.rmrkToCollection();
        }

    }


    private rmrkToNft(){

        const obj = this.obj;

        const nft = new Nft();

        nft.collection = obj.collection;
        nft.name = obj.name;
        nft.transferable = obj.transferable;
        nft.sn = obj.sn;
        nft.metadata = obj.metadata;
        nft.issuer = (obj.issuer === null) ? null : new KusamaAddress(obj.issuer);
        // nft.issuer = this.chain.getAddressClass(obj.issuer);
        nft.blockchain = this.chain;

        return nft;

    }


    private rmrkToCollection(){

        const obj = this.obj;

        const collection = new Collection();

        collection.version = obj.version;
        collection.name = obj.name;
        collection.max = obj.max;
        collection.symbol = obj.symbol;
        collection.id = obj.id;
        collection.metadata = obj.metadata;
        collection.blockchain = this.chain;
        collection.issuer = (obj.issuer === null) ? null : new KusamaAddress(obj.issuer);
        // collection.issuer = new KusamaAddress(obj.issuer);

        return collection;
    }
}