import {BlockchainAddress} from "./Addresses/BlockchainAddress";
import {Blockchain} from "./Blockchains/Blockchain";
import {Entity} from "./Rmrk/Entity";


export class Nft extends Entity
{

    collection;
    name: string;
    transferable: boolean;
    sn: string;
    metadata: string;
    issuer: BlockchainAddress;


    constructor(rmrk: string, chain: Blockchain, version: string) {

        super(rmrk, Nft.constructor.name, chain, version);
    }


    public rmrkToObject(obj){

        this.collection = obj.collection;
        this.name = obj.name;
        this.transferable = obj.transferable;
        this.sn = obj.sn;
        this.metadata = obj.metadata;

        if(typeof obj.issuer != 'undefined'){
            this.issuer = (obj.issuer === null) ? null : this.collection.chain.getAddressClass();
        }

        return this;
    }


}