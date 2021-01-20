
import {Blockchain} from "./Blockchains/Blockchain.js";


export interface BlockchainInterface
{
    name: string;
    symbol: string;
    prefix: string;
    isSubstrate: boolean;
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

export interface EntityInterface
{
    version: string,
    name: string,
    max: number,
    symbol: string,
    id: string,
    metadata: string,
    transferable: boolean|null,
    sn: string,
    collection: string
}