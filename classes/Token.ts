
import {BlockchainContract} from "./Contract/BlockchainContract.js";


export class Token
{

    transferable: boolean | null;
    sn: string;
    contractId: string;
    contract: BlockchainContract | undefined;


    constructor(
        transferable: boolean|null,
        sn: string,
        contract: BlockchainContract|string,
        ) {

        this.transferable = transferable;
        this.sn = sn;

        if(contract instanceof BlockchainContract){
            this.contract = contract;
            this.contractId = this.contract.id;
        }else{
            this.contractId = contract;
        }
    }



}