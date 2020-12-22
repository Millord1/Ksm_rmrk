import {Collection} from "./Collection";

interface TokenInterface
{
    name: string;
    collection: Collection
    transferable: boolean;
    sn: string;
    metadata: string;
}

export class Token
{
    name;
    collection;
    transferable;
    sn;
    metadata;

    constructor(
        name: string,
        collection: Collection,
        transferable: boolean,
        sn: string,
        metadata: string
    ){
        this.name = name;
        this.collection = collection;
        this.transferable = transferable;
        this.sn = sn;
        this.metadata = metadata;
    }
}