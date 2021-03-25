import {CollectionInterface, Interaction} from "./Interaction";
import {Collection} from "../Entities/Collection";
import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {Entity} from "../Entities/Entity";
import {VersionChecker} from "../VersionChecker";


export class Mint extends Interaction
{

    public collection?: Collection;

    public constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        const collection : Collection|undefined = this.collectionFromRmrk();

        if(collection){
            this.collection = collection;
        }
    }


    private collectionFromRmrk(): Collection|undefined
    {

        const rmrk = this.splitRmrk();

        let mintData: CollectionInterface

        try{
            mintData = JSON.parse(rmrk[rmrk.length-1]);
        }catch(e){
            console.log(e);
            return undefined;
        }

        mintData = this.slugifyCollectionObj(mintData);

        const versionChecker = new VersionChecker(this.version);

        if(versionChecker.checkCollectionVersion(mintData)){
            return new Collection(this.rmrk, this.chain, mintData);
        }
        return undefined;
    }

}