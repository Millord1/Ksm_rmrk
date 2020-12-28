import {Blockchain} from "./Blockchains/Blockchain";
import {Entity} from "./Rmrk/Entity";
import {BlockchainContract} from "./Contract/BlockchainContract";


export class Collection extends Entity
{

    metadata: string;
    name: string;
    contract: BlockchainContract;

    constructor(rmrk: string, chain: Blockchain, version: string) {
        super(rmrk, Collection.constructor.name, chain, version);
    }


    public rmrkToObject(obj){

        this.metadata = obj.metadata;
        this.name = obj.name;

        const address = this.chain.getAddressClass();
        address.address = obj.issuer;

        const myChain = this.chain.constructor;

        // @ts-ignore
        this.contract = myChain.contractClass;
        this.contract.createContract(obj, this.chain, this);

        return this;
    }

}