import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {Token} from './Token.js';
import {Transaction} from "./Transaction.js";
import {Remark} from "./Rmrk/Remark.js";
import {EntityInterface} from "./Interfaces.js";
import {Metadata} from "./Metadata.js";


export class Asset extends Entity
{

    name: string;
    token: Token;
    instance: string;
    assetId: string;

    constructor(
        rmrk: string,
        chain: Blockchain,
        version: string|null,
        transaction: Transaction,
        obj : EntityInterface,
        meta: Metadata|null
        ){
        super(rmrk, Asset.name, chain, version, transaction, meta);
        this.name = obj.name;
        this.instance = obj.instance;
        this.assetId = transaction.blockId + '-' + obj.collection + '-' + obj.name;

        this.token = new Token(obj.transferable, obj.sn, obj.collection);
    }



    public static createNftFromInteraction(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null){

        const splitted = rmrk.split('::');

        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');

        const nftDatas = splitted[3].split(',');
        const obj = Entity.dataTreatment(nftDatas, Remark.entityObj);

        return new Asset(rmrk, chain, null, transaction, obj, meta);
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