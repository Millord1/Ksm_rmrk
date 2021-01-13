import {BlockchainAddress} from "./Addresses/BlockchainAddress.js";
import {Blockchain} from "./Blockchains/Blockchain.js";
import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";


export class Nft extends Entity
{

    contractId: string;
    contract: BlockchainContract;
    name: string;
    transferable: boolean;
    sn: string;
    metadata: string;
    issuer: BlockchainAddress;


    constructor(rmrk: string, chain: Blockchain, version: string|null, signer: string) {
        super(rmrk, Nft.name, chain, version, signer);
    }


    public rmrkToObject(obj){

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
            this.issuer = (obj.issuer === null) ? null : this.contract.chain.getAddressClass();
        }

        return this;
    }


    public createNftFromInteraction(){

        const splitted = this.rmrk.split('::');

        splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
        const nftDatas = splitted[2].split(',');

        Entity.dataTreatment(nftDatas, this.nft);

        // nftDatas.forEach((data)=>{
        //     const datas = data.split(':');
        //
        //     if(datas.length > 2){
        //         if(datas[0] === 'metadata' && datas[1] === 'ipfs'){
        //             this.nft[datas[0]] = datas[1] + ':' + datas[2];
        //         }
        //     }else{
        //         this.nft[datas[0]] = datas[1];
        //     }
        //
        // });

        return this.rmrkToObject(this.nft);
    }



    public toJson(needStringify : boolean = true, needSubstrate: boolean = true){

        const json = this.toJsonSerialize();

        json['chain'] = this.chain.toJson(needSubstrate);

        json['contractId'] = this.contractId;
        json['contract'] = this.contract;
        json['name'] = this.name;
        json['transferable'] = this.transferable;
        json['sn'] = this.sn;
        json['metadata'] = this.metadata;
        json['issuer'] = this.issuer;

        return (needStringify) ? JSON.stringify(json) : json;
    }


}