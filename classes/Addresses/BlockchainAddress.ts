import {Blockchain} from "../Blockchains/Blockchain.js";


export abstract class BlockchainAddress
{
    address: string | undefined;
    blockchainName: string | undefined;
    public static blockchain: Blockchain;

    protected constructor(){
    }

    public toJson(){
        return {blockchainName: this.blockchainName}
    }

}