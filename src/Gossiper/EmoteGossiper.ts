import {GossiperManager} from "./GossiperManager";
import {Entity} from "../Remark/Entities/Entity";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {Interaction} from "../Remark/Interactions/Interaction";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";
import {Emote} from "../Remark/Interactions/Emote";
import {BlockchainToken} from "canonizer/src/canonizer/BlockchainToken";


class EmoteGossiper extends GossiperManager
{

    private blockId: number;
    private timestamp: string;
    private txId: string;
    private source: BlockchainAddress;

    private readonly sn: string|undefined;
    private token: BlockchainToken|undefined;

    constructor(remark: Emote, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        super(chain, csCanonizeManager);

        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
        this.source = new BlockchainAddress(this.chain.addressFactory, remark.transaction.source, this.canonizeManager.getSandra());

        if(remark.asset?.token.sn){
            this.sn = remark.asset.token.sn;
            this.token = new BlockchainToken(csCanonizeManager, this.sn);
        }
    }


    public async gossip()
    {

    }


}