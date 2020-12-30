import {BlockchainAddress} from "./Addresses/BlockchainAddress";
import {Blockchain} from "./Blockchains/Blockchain";
import {Entity} from "./Rmrk/Entity";
import {BlockchainContract} from "./Contract/BlockchainContract";


export class Nft extends Entity
{

    contractId: string;
    contract: BlockchainContract;
    name: string;
    transferable: boolean;
    sn: string;
    metadata: string;
    issuer: BlockchainAddress;


    constructor(rmrk: string, chain: Blockchain, version: string|null) {
        super(rmrk, Nft.constructor.name, chain, version);
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

        nftDatas.forEach((data)=>{
            const datas = data.split(':');

            if(datas.length > 2){
                if(datas[0] === 'metadata' && datas[1] === 'ipfs'){
                    this.nft[datas[0]] = datas[1] + ':' + datas[2];
                }
            }else{
                this.nft[datas[0]] = datas[1];
            }

        });

        return this.rmrkToObject(this.nft);
    }


}