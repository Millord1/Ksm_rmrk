import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";

export class ChangeIssuer extends Interaction
{

    collectionId: string;
    newIssuer: string;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, ChangeIssuer.name, chain, null);
    }

    public createChangeIssuer(){
        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.collectionId = splitted[3];
        this.newIssuer = splitted[4];

        return this;
    }

}