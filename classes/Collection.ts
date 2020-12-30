import {Blockchain} from "./Blockchains/Blockchain";
import {Entity} from "./Rmrk/Entity";
import {BlockchainContract} from "./Contract/BlockchainContract";


export class Collection extends Entity
{

    metadata: string;
    name: string;
    contract: BlockchainContract;

    constructor(rmrk: string, chain: Blockchain, version: string|null) {
        super(rmrk, Collection.constructor.name, chain, version);
    }


    public rmrkToObject(obj){

        this.metadata = obj.metadata;
        this.name = obj.name;
        this.version = obj.version;

        const address = this.chain.getAddressClass();
        address.address = obj.issuer;

        const myChain = this.chain.constructor;

        // @ts-ignore
        this.contract = myChain.contractClass;
        this.contract.createContract(obj, this.chain, this);

        return this;
    }


    public createCollectionFromInteraction(){

        const splitted = this.rmrk.split('::');

        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const datas = splitted[2].split(',');

        datas.forEach((index)=>{

            index = index.replace(/[&\/\\+_-]/g, ' ');

            const datas = index.split(':');

            if(datas.length > 2){
                if(datas[0] === 'metadata'){
                    this.collection[datas[0]] = datas[1] + ':' + datas[2];
                }
            }else{
                this.collection[datas[0]] = datas[1];
            }

        });

        return this.rmrkToObject(this.collection);
    }

}