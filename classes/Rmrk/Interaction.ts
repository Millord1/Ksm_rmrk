import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";


export class Interaction extends Remark
{

    interaction;

    constructor(rmrk: string, interaction:string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.interaction = interaction
    }

}