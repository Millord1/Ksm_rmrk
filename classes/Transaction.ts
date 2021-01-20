import {BlockchainAddress} from "./Addresses/BlockchainAddress.js";
import {Blockchain} from "./Blockchains/Blockchain.js";


export class Transaction
{

    public blockId : number;
    public txHash: string;
    public timestamp: string;
    public source: string;
    public blockchain: Blockchain;

    public destination: BlockchainAddress;


    constructor(
        blockchain: Blockchain,
        blockId: number,
        txHash: string,
        timestamp: string,
        source: string,
        destination: BlockchainAddress|null
    ){

        this.blockId = blockId;
        this.txHash = txHash;
        this.timestamp = timestamp;
        this.source = source;
        this.blockchain = blockchain;

        let receiver;
        if(destination === null){
            receiver = this.blockchain.getAddressClass('0x0');
        }else{
            receiver = destination;
        }

        this.destination = receiver;
    }


    public setDestination(destination: BlockchainAddress){
        this.destination = destination;
        return this;
    }

}