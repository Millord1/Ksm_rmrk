import {Blockchain} from "../../Blockchains/Blockchain";
import {CollectionInterface} from "../Interactions/Interaction";

export class BlockchainContract
{

    max: number;
    symbol: string;
    id: string;
    chain: Blockchain;
    collection: string;


    constructor(chain: Blockchain, ccollectionData: CollectionInterface) {
        this.max = ccollectionData.max;
        this.symbol = ccollectionData.symbol;
        this.id = ccollectionData.id;
        this.chain = chain;
        this.collection = ccollectionData.name;
    }



}