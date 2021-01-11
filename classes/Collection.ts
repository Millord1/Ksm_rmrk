import {Blockchain} from "./Blockchains/Blockchain";
import {Entity} from "./Rmrk/Entity";
import {BlockchainContract} from "./Contract/BlockchainContract";


export class Collection extends Entity
{

    metadata: string;
    name: string;
    contract: BlockchainContract;

    constructor(rmrk: string, chain: Blockchain, version: string|null) {
        super(rmrk, Collection.name, chain, version);
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
        // const datas = splitted[2].split(',');

        Entity.dataTreatment(splitted, this.collection);

        return this.rmrkToObject(this.collection);
    }



    public toJson(needStringify: boolean = true, needSubstrate: boolean = true){

        const json = this.toJsonSerialize();

        json['chain'] = this.chain.toJson(needSubstrate);

        json['metadata'] = this.metadata;
        json['name'] = this.name;
        json['contract'] = this.contract;

        return (needStringify) ? JSON.stringify(json) : json;
    }

}