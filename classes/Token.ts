import {Entity} from "./Rmrk/Entity.js";
import {BlockchainContract} from "./Contract/BlockchainContract.js";
import {Blockchain} from "./Blockchains/Blockchain.js";
import {Asset} from "./Asset.js";
import {Transaction} from "./Transaction.js";


export class Token extends Entity
{

    transferable: boolean | null;
    sn: string;
    contractId: string;
    contract: BlockchainContract | undefined;
    asset: Asset;


    constructor(
        rmrk: string,
        chain: Blockchain,
        version: string|null,
        transaction: Transaction,
        transferable: boolean|null,
        sn: string,
        contract: BlockchainContract|string,
        asset: Asset
        ) {
        super(rmrk, Token.name, chain, version, transaction);

        this.transferable = transferable;
        this.sn = sn;
        this.asset = asset;

        if(contract instanceof BlockchainContract){
            this.contract = contract;
            this.contractId = this.contract.id;
        }else{
            this.contractId = contract;
        }
    }



}