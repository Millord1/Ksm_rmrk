import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";


export class Entity extends Remark
{

    standard;

    constructor(rmrk: string, standard:string, chain: Blockchain) {
        super(Entity.constructor.name, '0.1', rmrk, chain);
        this.standard = standard;
    }

}