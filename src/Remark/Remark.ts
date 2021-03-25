import {Blockchain} from "../Blockchains/Blockchain";


export abstract class Remark
{
    public static actualVersion: string = '1.0.0';
    protected version: string;
    protected rmrk: string;
    public chain: Blockchain;

    protected constructor(rmrk: string, chain: Blockchain, version?: string)
    {
        this.rmrk = rmrk;
        this.chain = chain;
        this.version = version === undefined || version === "undefined" ? Remark.actualVersion : version;
    }

}