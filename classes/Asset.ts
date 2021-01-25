import {BlockchainAddress} from "./Addresses/BlockchainAddress.js";
import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";
import {Token} from './Token.js';
import {Transaction} from "./Transaction.js";
import {Remark} from "./Rmrk/Remark.js";
import {EntityInterface} from "./Interfaces.js";
import {Metadata} from "./Metadata.js";


export class Asset extends Entity
{

    name: string;
    metadata: string;
    token: Token;


    constructor(
        rmrk: string,
        chain: Blockchain,
        version: string|null,
        transaction: Transaction,
        obj : EntityInterface,
        url: string
        ) {
        super(rmrk, Asset.name, chain, version, transaction, url);
        this.name = obj.name;
        this.metadata = obj.metadata;

        this.token = new Token(this.rmrk, this.chain, this.version, this.transaction, obj.transferable, obj.sn, obj.collection, this);
    }



    public static createNftFromInteraction(rmrk: string, chain: Blockchain, transaction: Transaction){

        const splitted = rmrk.split('::');

        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const nftDatas = splitted[2].split(',');

        const obj = Entity.dataTreatment(nftDatas, Remark.entityObj);

        return new Asset(rmrk, chain, null, transaction, obj, obj.metadata);
    }



    public toJson(needStringify : boolean = true, needSubstrate: boolean = true){

        const json = this.toJsonSerialize();

        // @ts-ignore
        json['chain'] = this.chain.toJson(needSubstrate);

        // @ts-ignore
        json['contractId'] = this.token.contractId;
        // @ts-ignore
        json['contract'] = this.token.contract;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['transferable'] = this.token.transferable;
        // @ts-ignore
        json['sn'] = this.token.sn;
        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['issuer'] = this.transaction.source.address;
        // @ts-ignore
        json['receiver'] = this.transaction.destination.address;

        return (needStringify) ? JSON.stringify(json) : json;
    }


}