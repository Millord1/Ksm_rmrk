import {Entity} from "./Entity";
import {Blockchain} from "../../Blockchains/Blockchain";
import {BlockchainContract} from "./BlockchainContract";
import {CollectionInterface} from "../Interactions/Interaction";


export class Collection extends Entity
{

    public name: string;
    public collectionId: string
    public contract: BlockchainContract;

    public constructor(rmrk: string, chain: Blockchain, collectionData: CollectionInterface, version?: string) {

        const rmrkV = version ? version : collectionData.version;

        super(rmrk, chain, collectionData.metadata, rmrkV);

        this.name = collectionData.name;
        this.collectionId = collectionData.id;

        this.contract = new BlockchainContract(this.chain, collectionData);
    }

}