import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";


export class Interaction extends Remark
{

    interaction;

    constructor(rmrk: string, interaction:string, chain: Blockchain) {
        super(Interaction.constructor.name, '0.1', rmrk, chain);
        this.interaction = interaction
    }

}