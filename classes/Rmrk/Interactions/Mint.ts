import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Collection} from "../../Collection";

export class Mint extends Interaction
{

    myCollection: Collection;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, Mint.name, chain, null);
    }

    public createMint(){
        const myCollection = new Collection(this.rmrk, this.chain, null);
        this.myCollection = myCollection.createCollectionFromInteraction();
        return this;
    }


    public toJson(){
        const json = this.myCollection.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}