import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";
import {BlockchainAddress} from "../../Addresses/BlockchainAddress";


export class Send extends Interaction
{

    nft;
    recipient: BlockchainAddress;

    constructor(rmrk: string, chain: Blockchain){
        super(rmrk, Send.constructor.name, chain, null);
    }

    public createSend(){

        const splitted = this.rmrkToArray();

        this.version = splitted[2];
        this.nft = splitted[3];

        const blockchainAddress = this.chain.getAddressClass();
        blockchainAddress.address = splitted[4];
        this.recipient = blockchainAddress;

        return this;
    }

}