import {BlockchainAddress} from "./Addresses/BlockchainAddress";
import {Blockchain} from "./Blockchains/Blockchain";


export interface BlockchainInterface
{
    name: string;
    symbol: string;
    prefix: string;
    isSubstrate: boolean;
    // address: BlockchainAddress
}


export interface publicInteraction
{
    version: string;
    rmrk: string;
    chain: Blockchain;
    interaction: string;
}

export interface publicEntity
{
    version: string;
    rmrk: string;
    chain: Blockchain;
    standard: string
}