import {GossiperManager} from "./GossiperManager";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";
import {Emote} from "../Remark/Interactions/Emote";
import {RmrkContractStandard} from "canonizer/src/canonizer/Interfaces/RmrkContractStandard";
import {BlockchainEmote} from "canonizer/src/canonizer/BlockchainEmote";
import {BlockchainEmoteFactory} from "canonizer/src/canonizer/BlockchainEmoteFactory";
import {BlockchainToken} from "canonizer/src/canonizer/BlockchainToken";
import {BlockchainContract} from "canonizer/src/canonizer/BlockchainContract";

export class EmoteGossiper extends GossiperManager
{

    private blockId: number;
    private timestamp: string;
    private txId: string;
    private source: BlockchainAddress;
    private unicode: string;

    private token: RmrkContractStandard|undefined;
    private contract: BlockchainContract|undefined;

    constructor(remark: Emote, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        super(chain, csCanonizeManager);

        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
        this.source = new BlockchainAddress(this.chain.addressFactory, remark.transaction.source, this.canonizeManager.getSandra());
        this.unicode = remark.unicode ? remark.unicode : "";

        if(remark.asset){
            this.token = new RmrkContractStandard(csCanonizeManager);
            this.token.setSn(remark.asset.token.sn);

            this.contract = new BlockchainContract(this.chain.contractFactory, remark.asset.contractId, this.canonizeManager.getSandra());
        }
    }


    public async gossip()
    {
        if(this.token && this.contract){
            const emote = new BlockchainEmote(
                this.chain.emoteFactory,
                this.canonizeManager.getSandra(),
                this.chain,
                this.source,
                this.txId,
                this.blockId,
                this.timestamp,
                this.unicode,
                this.token,
                this.contract
            );
        }

    }


}