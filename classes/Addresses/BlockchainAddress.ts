import {Blockchain} from "../Blockchains/Blockchain";
import {SubstrateChain} from "../Blockchains/SubstrateChain";

export abstract class BlockchainAddress
{
    address: string;
    blockchainName: string;
    public static blockchain;

    protected constructor(){
    }

}