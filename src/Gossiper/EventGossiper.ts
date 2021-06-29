import {Send} from "../Remark/Interactions/Send";
import {MintNft} from "../Remark/Interactions/MintNft";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";
import {BlockchainContract} from "canonizer/src/canonizer/BlockchainContract";
import {RmrkContractStandard} from "canonizer/src/canonizer/Interfaces/RmrkContractStandard";
import {BlockchainEvent} from "canonizer/src/canonizer/BlockchainEvent";
import {GossiperManager} from "./GossiperManager";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";

export class EventGossiper extends GossiperManager
{

    private readonly contractId: string;
    private readonly sn: string;
    private readonly signer: string;
    private readonly receiver: string;
    private readonly blockId: number;
    private readonly timestamp: string;
    private readonly txId: string;


    constructor(remark: Send|MintNft, csCanonizeManager: CSCanonizeManager, chain: Blockchain){

        super(chain, csCanonizeManager);

        this.contractId = remark.asset ? remark.asset.contractId : "";
        this.sn = remark.asset ? remark.asset.token.sn : "";
        this.signer = remark.transaction.source;
        this.receiver = remark.transaction.destination ? remark.transaction.destination : "";
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;
    }

    public async gossip()
    {
        if(this.sn == ""){
            return undefined;
        }

        const canonizeManager = this.canonizeManager;
        const sandra = canonizeManager.getSandra();

        const receiver = new BlockchainAddress(this.chain.addressFactory, this.receiver, sandra);
        const address = new BlockchainAddress(this.chain.addressFactory, this.signer, sandra);

        const contract = new BlockchainContract(this.chain.contractFactory, this.contractId, sandra,new RmrkContractStandard(canonizeManager));
        const contractStandard = new RmrkContractStandard(canonizeManager, this.sn);

        let event = new BlockchainEvent(this.chain.eventFactory, address, receiver, contract, this.txId, this.timestamp, '1', this.chain, this.blockId, contractStandard, sandra);
        // canonizeManager.gossipBlockchainEvents(this.chain).then(()=>{console.log("event gossiped " + this.blockId)});
    }

}