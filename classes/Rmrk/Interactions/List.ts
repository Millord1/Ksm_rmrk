import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";

export class List extends Interaction
{

    nftId: string;
    price;

    constructor(rmrk: string, chain: Blockchain) {
        super(rmrk, List.constructor.name, chain, null);
    }

    public createList(){

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.nftId = splitted[3];
        this.price = splitted[4];

        return this;
    }

}