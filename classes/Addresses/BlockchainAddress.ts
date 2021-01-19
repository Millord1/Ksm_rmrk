import {Blockchain} from "../Blockchains/Blockchain.js";


export abstract class BlockchainAddress
{
    address: string;
    blockchainName: string;
    public static blockchain: Blockchain;

    protected constructor(address: string, blockchainName: string){
        this.address = address;
        this.blockchainName = blockchainName;
    }

    public toJson(){
        return {blockchainName: this.blockchainName}
    }

}