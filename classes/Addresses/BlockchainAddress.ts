

export abstract class BlockchainAddress
{
    address: string;
    blockchainName: string;
    public static blockchain;

    protected constructor(){
    }

    public toJson(){
        return {blockchainName: this.blockchainName}
    }
 
}