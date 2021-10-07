import {Jetski} from "../Jetski/Jetski";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";


export abstract class Blockchain
{
    public symbol: string;
    public prefix: string;
    public isSubstrate: boolean;
    public wsProvider: string;

    public decimale: number;

    protected constructor(symbol: string, prefix: string, isSubstrate: boolean, wsProvider: string, decimale: number)
    {
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
        this.decimale = decimale;
    }

    // abstract getBlockData( {method}: {method: {args: any, method: any, section: any} } ): Array<any>
    abstract getBlockData( block: any, blockId: number, blockTimestamp: string, chain: Blockchain, jetski: Jetski ): Promise<Array<any>>

    abstract sendGossip(canonizeManager: CSCanonizeManager, block: number, blockchain: any): Promise<string>


    public plancksToCrypto(value: number)
    {
        return value / Math.pow(10, this.decimale);
    }
}