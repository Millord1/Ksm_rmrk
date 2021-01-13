import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";


export class Collection extends Entity
{

    metadata: string | undefined;
    name: string | undefined;
    contract: BlockchainContract | undefined;

    constructor(rmrk: string, chain: Blockchain, version: string|null, signer:string) {
        super(rmrk, Collection.name, chain, version, signer);
    }


    public rmrkToObject(obj: any){

        this.metadata = obj.metadata;
        this.name = obj.name;
        this.version = obj.version;

        const address = this.chain.getAddressClass();
        address.address = obj.issuer;

        const myChain = this.chain.constructor;

        // @ts-ignore
        this.contract = myChain.contractClass;
        // @ts-ignore
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

        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);

        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['contract'] = this.contract;

        return (needStringify) ? JSON.stringify(json) : json;
    }

}