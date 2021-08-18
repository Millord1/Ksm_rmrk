import {Blockchain} from "../../Blockchains/Blockchain";
import {Transaction} from "../Transaction";
import {Entity} from "../Entities/Entity";
import {Interaction} from "./Interaction";


export class ChangeIssuer extends Interaction
{

    public collectionId?: string;
    public newOwner?: string;

    public constructor(rmrk: string, chain: Blockchain, transaction: Transaction) {
        super(rmrk, chain, transaction);

        const rmrkArray = rmrk.split('::');
        this.newOwner = rmrkArray.pop();
        this.collectionId = rmrkArray.pop();
    }


    public getEntity(): Entity | undefined {
        return undefined;
    }

}