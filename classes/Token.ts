import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";
import {Blockchain} from "./Blockchains/Blockchain.js";
import {Asset} from "./Asset.js";
import {Transaction} from "./Transaction.js";


export class Token extends Entity
{

    transferable: boolean | undefined;
    sn: string | undefined;
    contractId: string | undefined;
    contract: BlockchainContract | undefined;
    asset: Asset | undefined;


    constructor(rmrk: string, chain: Blockchain, version: string|null, transaction: Transaction) {
        super(rmrk, Token.name, chain, version, transaction);
    }


    public setDatas(transferable: boolean, sn: string, contract: string|BlockchainContract, asset: Asset){

        this.transferable = transferable;
        this.sn = sn;
        this.asset = asset;

        if(contract instanceof BlockchainContract){
            this.contract = contract;
            this.contractId = this.contract.id;
        }else{
            this.contractId = contract;
        }

        return this;
    }


    public getContract(): any {

        if ( this.contract instanceof BlockchainContract){
            return this.contract;
        }else{
            return this.contractId;
        }
    }


}