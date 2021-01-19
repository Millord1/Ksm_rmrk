import {BlockchainAddress} from "./Addresses/BlockchainAddress.js";
import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";
import {Token} from './Token.js';


export class Asset extends Entity
{

    name: string | undefined;
    metadata: string | undefined;
    issuer: BlockchainAddress | undefined;
    token: Token | undefined;


    constructor(rmrk: string, chain: Blockchain, version: string|null, signer: string) {
        super(rmrk, Asset.name, chain, version, signer);
    }


    public rmrkToObject(obj: any){

        this.name = obj.name;
        this.metadata = obj.metadata;

        if(typeof obj.issuer != 'undefined'){
            // @ts-ignore
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }

        const token = new Token(this.rmrk, this.chain, this.version, this.signer);
        this.token = token.setDatas(obj.transferable, obj.sn, obj.collection, this);

        this.getMetadatasContent();
        // if(obj.metadata != null){
        //     const metadatas = this.getMetadatasContent(obj.metadata);
        // }

        return this;
    }


    public createNftFromInteraction(){

        const splitted = this.rmrk.split('::');

        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const nftDatas = splitted[2].split(',');

        Entity.dataTreatment(nftDatas, this.nft);

        return this.rmrkToObject(this.nft);
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
        json['issuer'] = this.issuer;

        return (needStringify) ? JSON.stringify(json) : json;
    }


}