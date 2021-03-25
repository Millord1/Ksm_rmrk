import {Blockchain} from "../Blockchains/Blockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";

export class Transaction
{
    public blockId: number;
    public txHash: string;
    public timestamp: string;
    public source: string;
    public destination?: string;
    public value?: string;
    public chain: Blockchain;

    constructor(
        blockId: number,
        txHash: string,
        timestamp: string,
        chain: Blockchain,
        source: string,
        destination?: string,
        value?: string
    ){

        this.blockId = blockId;
        this.txHash = txHash;
        this.timestamp = timestamp;
        this.source = source;
        this.chain = chain;

        if(destination === undefined){
            this.destination = CSCanonizeManager.mintIssuerAddressString;
        }else{
            this.destination = destination;
        }

        this.value = value;

    }
}