import {Interaction} from "../Interaction";
import {Blockchain} from "../../Blockchains/Blockchain";


export class Send extends Interaction
{

    nft;
    recipient;

    constructor(rmrk: string, obj, chain: Blockchain){
        super(rmrk, obj.interaction, chain, obj.version);

        this.nft = obj.nft;
        const blockchainAddress = chain.getAddressClass();
        blockchainAddress.address = obj.address;
        this.recipient = blockchainAddress;
    }

}