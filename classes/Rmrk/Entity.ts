import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";
import {publicEntity} from "../Interfaces";


export abstract class Entity extends Remark implements publicEntity
{

    standard;

    protected constructor(rmrk: string, standard: string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.standard = standard;
    }

    toJsonSerialize = () : publicEntity => ({
        version: this.version,
        rmrk: this.rmrk,
        chain: this.chain,
        standard: this.standard
    })

}