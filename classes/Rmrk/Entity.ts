import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";


export class Entity extends Remark
{

    standard;

    constructor(rmrk: string, standard: string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.standard = standard;
    }

}