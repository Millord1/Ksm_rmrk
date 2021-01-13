import {Blockchain} from "../Blockchains/Blockchain.js";


export abstract class Remark
{
    private defaultVersion = '0.1';

    protected signer: string;

    protected nft = {
        collection: null,
        name: null,
        sn: null,
        metadata: null,
        transferable: null
    };

    protected collection = {
        version: null,
        name: null,
        metadata: null,
        max: null,
        symbol: null,
        id: null,

        issuer: null,
    }

    version: string;
    rmrk: string;
    chain: Blockchain;

    protected constructor(version: string|null, rmrk: string, chain: Blockchain, signer: string){

        this.rmrk = rmrk;
        this.chain = chain;

        if(version === null){
            version = this.defaultVersion;
        }

        this.signer = signer;

        this.version = version;
    }


}