import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";

export class Buy extends Interaction
{

    nftId;

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, Buy.constructor.name, chain, null);
    }

    public createBuy(){
        const splitted = this.rmrkToArray();
        this.nftId = splitted[3];
        return this;
    }

}