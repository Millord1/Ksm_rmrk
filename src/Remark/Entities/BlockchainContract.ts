import {Blockchain} from "../../Blockchains/Blockchain";
import {CollectionInterface} from "../Interactions/Interaction";

export class BlockchainContract
{

    max: number;
    symbol: string;
    id: string;
    chain: Blockchain;
    collection: string;


    constructor(chain: Blockchain, collectionData: CollectionInterface) {
        this.max = collectionData.max;
        this.symbol = collectionData.symbol;
        this.id = collectionData.id;
        this.chain = chain;
        this.collection = collectionData.name;
    }



}