import {BlockchainAddress} from "./Addresses/BlockchainAddress.js";
import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";


export class Nft extends Entity
{

    contractId: string | undefined;
    contract: BlockchainContract | undefined;
    name: string | undefined;
    transferable: boolean | undefined;
    sn: string | undefined;
    metadata: string | undefined;
    issuer: BlockchainAddress | undefined;


    constructor(rmrk: string, chain: Blockchain, version: string|null, signer: string) {
        super(rmrk, Nft.name, chain, version, signer);
    }


    public rmrkToObject(obj: any){

        if(obj.contract instanceof BlockchainContract){
            this.contract = obj.collection;
        }else{
            this.contractId = obj.collection;
        }

        this.name = obj.name;
        this.transferable = obj.transferable;
        this.sn = obj.sn;
        this.metadata = obj.metadata;

        if(typeof obj.issuer != 'undefined'){
            // @ts-ignore
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }

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
        json['contractId'] = this.contractId;
        // @ts-ignore
        json['contract'] = this.contract;
        // @ts-ignore
        json['name'] = this.name;
        // @ts-ignore
        json['transferable'] = this.transferable;
        // @ts-ignore
        json['sn'] = this.sn;
        // @ts-ignore
        json['metadata'] = this.metadata;
        // @ts-ignore
        json['issuer'] = this.issuer;

        return (needStringify) ? JSON.stringify(json) : json;
    }


}