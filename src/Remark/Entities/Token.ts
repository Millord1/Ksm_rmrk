import {BlockchainContract} from "./BlockchainContract";


export class Token
{

    public sn: string;
    public collectionId: string;
    public transferable?: boolean;
    public contract?: BlockchainContract;

    constructor(sn: string, contract: BlockchainContract|string, transferable?: boolean) {
        this.sn = sn;
        this.transferable = transferable;

        if(contract instanceof BlockchainContract){
            this.contract = contract;
            this.collectionId = this.contract.id;
        }else{
            this.collectionId = contract;
        }
    }


}