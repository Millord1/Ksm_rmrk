import {Entity} from "./Entity";
import {Blockchain} from "../../Blockchains/Blockchain";
import {NftInterface} from "../Interactions/Interaction";
import {Token} from "./Token";


export class Asset extends Entity
{
    public name: string;
    public instance: string;
    public contractId: string;

    public token: Token;

    constructor(rmrk: string, chain: Blockchain, nftData: NftInterface, version?: string) {
        super(rmrk, chain, nftData.metadata, version);

        this.name = nftData.name;
        this.instance = nftData.instance;
        this.contractId = nftData.contractId;

        this.token = new Token(nftData.sn, nftData.collection, nftData.transferable);
    }

}