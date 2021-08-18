import {GossiperManager} from "./GossiperManager";
import {ChangeIssuer} from "../Remark/Interactions/ChangeIssuer";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {ChangeIssuerFactory} from "canonizer/src/canonizer/ChangeIssuerFactory";
import {ChangeIssuer as GossipChangeIssuer} from "canonizer/src/canonizer/ChangeIssuer";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";

export class ChangeIssuerGossiper extends GossiperManager
{

    private collectionId: string;
    private newOwner: string;
    private source: string;
    private txId: string;
    private timestamp: string;
    private blockId: number;

    constructor(remark: ChangeIssuer, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        super(chain, csCanonizeManager);

        let collectionId = "";
        let newOwner = "";

        if(remark.collectionId && remark.newOwner){
            collectionId = remark.collectionId;
            newOwner = remark.newOwner;
        }

        this.source = remark.transaction.source;
        this.txId = remark.transaction.txHash;
        this.timestamp = remark.transaction.timestamp;
        this.blockId = remark.transaction.blockId;

        this.collectionId = collectionId;
        this.newOwner = newOwner;

    }

    public async gossip()
    {
        const sandra = this.canonizeManager.getSandra();

        const source = new BlockchainAddress(this.chain.addressFactory, this.source, sandra);
        const newIssuer = new BlockchainAddress(this.chain.addressFactory, this.newOwner, sandra);

        let changeIssuer = new GossipChangeIssuer(
            this.chain.changeIssuerFactory,
            source,
            this.collectionId,
            newIssuer,
            this.txId,
            this.timestamp,
            this.blockId,
            this.chain,
            sandra
        )

    }


}