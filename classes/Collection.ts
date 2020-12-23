import {Blockchain} from "./Blockchains/Blockchain";
import {BlockchainAddress} from "./Addresses/BlockchainAddress";
import {Entity} from "./Rmrk/Entity";
import {EntityInterface} from "./Rmrk/Interfaces";


export class Collection extends Entity implements EntityInterface
{
    version: string;
    name: string;
    max: number;
    issuer: BlockchainAddress;
    symbol: string;
    id: string;
    metadata: string;

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, Collection.constructor.name, chain);
    }


    public rmrkToObject(obj){

        // console.log(this.chain.getAddressClass());

        const address = this.chain.getAddressClass();
        address.address = obj.issuer;

        console.log(address);

        this.version = obj.version;
        this.name = obj.name;
        this.max = obj.max;
        this.symbol = obj.symbol;
        this.id = obj.id;
        this.metadata = obj.metadata;
        this.issuer = (obj.issuer === null) ? null : this.chain.getAddressClass();
        // collection.issuer = new KusamaAddress(obj.issuer);

        return this;
    }

}