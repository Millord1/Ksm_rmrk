import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";

export class ChangeIssuer extends Interaction
{

    collectionId: string;
    newIssuer: string;

    constructor(rmrk: string, chain: Blockchain){

        const splitted = rmrk.split('::');

        super(rmrk, splitted[1].toLowerCase(), chain, splitted[2]);

        this.collectionId = splitted[3];
        this.newIssuer = splitted[4];
    }


}