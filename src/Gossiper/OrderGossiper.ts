import {GossiperManager} from "./GossiperManager";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {Buy} from "../Remark/Interactions/Buy";
import {List} from "../Remark/Interactions/List";
import {BlockchainAddress} from "canonizer/src/canonizer/BlockchainAddress";
import {BlockchainOrder} from "canonizer/src/canonizer/BlockchainOrder";
import {BlockchainContract} from "canonizer/src/canonizer/BlockchainContract";
import {RmrkContractStandard} from "canonizer/src/canonizer/Interfaces/RmrkContractStandard";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";


export class OrderGossiper extends GossiperManager
{

    private readonly buyContractId: string;
    private readonly sellContractId: string;
    private readonly sn: string;
    private readonly signer: string;
    private readonly blockId: number;
    private readonly timestamp: string;
    private readonly txId: string;

    private readonly value: number;
    private readonly amount: number = 1;
    private readonly total: number;


    constructor(remark: Buy|List, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        super(chain, csCanonizeManager);


        if(remark instanceof Buy){
            this.buyContractId = remark.asset ? remark.asset.contractId : "";
            this.sellContractId = "KSM";
        }else{
            this.sellContractId = remark.asset ? remark.asset.contractId : "";
            this.buyContractId = "KSM";
        }

        this.sn = remark.asset ? remark.asset.token.sn : "";
        this.signer = remark.transaction.source;
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;

        const value = Number(remark.transaction.value);
        this.value = remark.chain.plancksToCrypto(value)

        this.total = this.value * this.amount;

    }


    public gossip()
    {

        const canonizeManager = this.canonizeManager;
        const sandra = canonizeManager.getSandra();

        const source = new BlockchainAddress(this.chain.addressFactory, this.signer, sandra);

        const buyAmount = String(this.amount);
        const sellPrice = String(this.value);
        const total = String(this.total);

        const txId = this.txId;
        const timestamp = this.timestamp;

        // TODO when implemented in Canonizer
        const ksmContractStd = null;
        // const ksmContractStd = new KsmContractStandard(canonizeManager);

        const rmrkStd = new RmrkContractStandard(canonizeManager);

        const contractSell = new BlockchainContract(this.chain.contractFactory, this.sellContractId, sandra, new RmrkContractStandard(canonizeManager));

        return new BlockchainOrder(this.chain.eventFactory, source, this.buyContractId, contractSell, buyAmount, sellPrice, total, txId, timestamp, this.chain, this.blockId, ksmContractStd, rmrkStd, sandra)

    }

}