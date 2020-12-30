import {Blockchain} from "../Blockchains/Blockchain";

export abstract class Remark
{
    private defaultVersion = '0.1';

    version;
    rmrk;
    chain: Blockchain;

    protected constructor(version, rmrk, chain){
        this.rmrk = rmrk;
        this.chain = chain;

        if(version === null){
            version = this.defaultVersion;
        }

        this.version = version;
    }

}