import {Remark} from "./Remark";
import {Blockchain} from "../Blockchains/Blockchain";


export abstract class Interaction extends Remark
{

    interaction;

    protected constructor(rmrk: string, interaction:string, chain: Blockchain, version) {
        super(version, rmrk, chain);
        this.interaction = interaction
    }

    public rmrkToArray(){
        return this.rmrk.split('::');
    }

}