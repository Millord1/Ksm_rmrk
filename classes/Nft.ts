import {BlockchainAddress} from "./Addresses/BlockchainAddress";
import {Blockchain} from "./Blockchains/Blockchain";
import {Entity} from "./Rmrk/Entity";
import {KusamaAddress} from "./Addresses/KusamaAddress";
import {EntityInterface} from "./Rmrk/Interfaces";


export class Nft extends Entity implements EntityInterface
{

    collection: string;
    name: string;
    transferable: boolean;
    sn: string;
    metadata: string;
    issuer: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, Nft.constructor.name, chain);
    }

    public rmrkToObject(obj){


        this.collection = obj.collection;
        this.name = obj.name;
        this.transferable = obj.transferable;
        this.sn = obj.sn;
        this.metadata = obj.metadata;
        // this.issuer = (obj.issuer === null) ? null : new KusamaAddress(obj.issuer);
        // nft.issuer = this.chain.getAddressClass(obj.issuer);

        return this;

    }

}