import {Blockchain} from "../Blockchains/Blockchain";

export class Remark
{
    defaultVersion = '0.1';

    version;
    rmrk;
    chain: Blockchain;

    constructor(version, rmrk, chain){
        this.rmrk = rmrk;
        this.chain = chain;

        if(version === null){
            version = this.defaultVersion;
        }

        this.version = version;
    }

}