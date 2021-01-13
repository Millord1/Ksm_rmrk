import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Collection} from "../../Collection.js";

export class Mint extends Interaction
{

    myCollection: Collection;

    constructor(rmrk: string, chain: Blockchain, signer: string){
        super(rmrk, Mint.name, chain, null, signer);
    }

    public createMint(){
        //@ts-ignore
        const myCollection = new Collection(this.rmrk, this.chain, null, this.signer.address);
        this.myCollection = myCollection.createCollectionFromInteraction();
        return this;
    }


    public toJson(){
        const json = this.myCollection.toJson(false);
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}