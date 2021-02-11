import {BlockchainContract} from "../BlockchainContract.js";
import {BlockchainContractFactory} from "../BlockchainContractFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {ContractStandard} from "../ContractStandard.js";
import {Reference} from "../../Reference.js";


export class RmrkContract extends BlockchainContract
{

    public static BLOCK_ID: string = "rmrk_block_id";
    public static COLLECTION_ID: string = "rmrk_collection_id";
    public static ASSET_NAME: string = "rmrk_asset-name";

    constructor(factory: BlockchainContractFactory|null, id: string, sandra: SandraManager, standard: ContractStandard|null = null) {
        super(factory, id, sandra, standard);

        let contractId: Array<string> = [];

        try{
            contractId = this.checkIdIntegrity(id);
        }catch(e){
            console.error(e);
        }

        if(contractId.length > 0){
            this.addReference(new Reference(sandra.get(RmrkContract.BLOCK_ID), contractId[0]));
            this.addReference(new Reference(sandra.get(RmrkContract.COLLECTION_ID), contractId[1]));
            this.addReference(new Reference(sandra.get(RmrkContract.ASSET_NAME), contractId[2]));
        }

    }

    private checkIdIntegrity(id: string): Array<string>
    {
        const idSplit = id.split('-');

        if(idSplit.length != 3){
            throw 'This contract ID length is uncorrect';
        }

        if(Number.isNaN(idSplit[0])){
            throw 'Missing block ID in contract ID';
        }

        return idSplit;
    }


}