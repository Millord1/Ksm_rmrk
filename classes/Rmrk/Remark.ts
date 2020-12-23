import {Blockchain} from "../Blockchains/Blockchain";

export class Remark
{
    type: string;
    version;
    rmrk;
    chain: Blockchain;

    constructor(type, version, rmrk, chain){
        this.rmrk = rmrk;
        this.version = version;
        this.type = type;
        this.chain = chain;
    }

}