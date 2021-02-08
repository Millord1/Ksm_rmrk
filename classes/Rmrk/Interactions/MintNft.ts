import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";
import {Metadata} from "../../Metadata.js";
import {AssetRmrk} from "../../Interfaces.js";
import {stringToHex} from "@polkadot/util";


export class MintNft extends Interaction
{
    nft: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction, meta: Metadata|null){
        super(rmrk, MintNft.name, chain, null, transaction);

        const splitted = this.rmrkToArray();

        // Hack for old rmrk
        const isCorrectVersion: boolean = this.versionVerifier(splitted[2]);

        if(isCorrectVersion){
            this.version = splitted[2];
        }else{
            this.version = '0.1';
        }

        this.nft = Asset.createNftFromInteraction(rmrk,chain,transaction, meta);
    }

    // Hack for old rmrk
    // TODO Delete this when useless
    private versionVerifier(version: string){

        const acceptedVersions: Array<string> = [
            'RMRK0.1',
            '0.1',
            '1.0.0'
        ];

        acceptedVersions.forEach((v)=>{
            if(version === v){
                return true;
            }
        })

        return false;
    }


    public toJson(){
        const json = this.nft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }

}