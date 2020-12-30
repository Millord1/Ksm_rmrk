import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";


export abstract class Entity extends Remark
{

    standard;

    protected constructor(rmrk: string, standard: string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.standard = standard;
    }

}