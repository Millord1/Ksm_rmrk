import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Collection} from "../../Collection";

export class Mint extends Interaction
{

    collection: Collection;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, Mint.constructor.name, chain, null);
    }

    public createMint(){
        const myCollection = new Collection(this.rmrk, this.chain, null);
        this.collection = myCollection.createCollectionFromInteraction();
        return this;
    }
}