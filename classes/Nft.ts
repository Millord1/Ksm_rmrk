import {BlockchainAddress} from "./Addresses/BlockchainAddress";
import {Blockchain} from "./Blockchains/Blockchain";


export class Nft
{

    collection: string;
    name: string;
    transferable: boolean;
    sn: string;
    metadata: string;
    issuer: BlockchainAddress;
    blockchain: Blockchain;

}