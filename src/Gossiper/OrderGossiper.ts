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
    private buyDestination : string = "";

    private readonly value: number = 1;
    private readonly amount: number = 1;
    private readonly total: number;


    constructor(remark: Buy|List, csCanonizeManager: CSCanonizeManager, chain: Blockchain) {
        super(chain, csCanonizeManager);


        if(remark instanceof Buy){

            this.buyContractId = remark.asset ? remark.asset.contractId : "";
            this.sellContractId = "KSM";
            this.buyDestination = remark.transaction.destination ? remark.transaction.destination : "";
            const amount = Number(remark.transaction.value);
            this.amount = remark.chain.plancksToCrypto(amount);

        }else{

            this.sellContractId = remark.asset ? remark.asset.contractId : "";
            this.buyContractId = "KSM";
            const value = Number(remark.value);
            this.value = remark.chain.plancksToCrypto(value);
        }

        this.sn = remark.asset ? remark.asset.token.sn : "";
        this.signer = remark.transaction.source;
        this.blockId = remark.transaction.blockId;
        this.timestamp = remark.transaction.timestamp;
        this.txId = remark.transaction.txHash;

        this.total = this.amount;

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

        let tokenToBuy: RmrkContractStandard;
        let tokenToSell: RmrkContractStandard;

        if(this.buyDestination != ""){
            // BUY
            tokenToSell = new RmrkContractStandard(canonizeManager);
            tokenToBuy = new RmrkContractStandard(canonizeManager);
            tokenToBuy.setSn(this.sn);
            tokenToBuy.generateTokenPathEntity(canonizeManager);

        }else{
            // LIST
            tokenToBuy = new RmrkContractStandard(canonizeManager);
            tokenToSell = new RmrkContractStandard(canonizeManager);
            tokenToSell.setSn(this.sn);
            tokenToSell.generateTokenPathEntity(canonizeManager);
        }

        let contractSell: BlockchainContract;
        let contractBuy: BlockchainContract;

        contractSell = new BlockchainContract(this.chain.contractFactory, this.sellContractId, sandra, new RmrkContractStandard(canonizeManager));
        contractBuy = new BlockchainContract(this.chain.contractFactory, this.buyContractId, sandra, new RmrkContractStandard(canonizeManager));

        let order =  new BlockchainOrder(this.chain.orderFactory, source, contractBuy, contractSell, buyAmount, sellPrice, total, txId, timestamp, this.chain, this.blockId, tokenToBuy, tokenToSell, sandra, this.buyDestination)
    }

}