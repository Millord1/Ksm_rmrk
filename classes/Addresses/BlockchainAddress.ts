import {Blockchain} from "../Blockchains/Blockchain.js";


export abstract class BlockchainAddress
{
    address: string | undefined;
    blockchainName: string | undefined;
    protected constructor(){
    }
    public toJson(){
        return {blockchainName: this.blockchainName}
    }
}