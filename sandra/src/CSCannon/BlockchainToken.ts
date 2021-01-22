import {Entity} from "../Entity.js";
import {SandraManager} from "../SandraManager.js";
import {CSCanonizeManager} from "./CSCanonizeManager.js";
import {BlockchainTokenFactory} from "./BlockchainTokenFactory.js";
import {Reference} from "../Reference.js";
import {BlockchainContract} from "./BlockchainContract.js";
import {Asset} from "./Asset.js";
import {BlockchainContractFactory} from "./BlockchainContractFactory.js";

export class BlockchainToken extends Entity{


 public constructor(canonizeManager:CSCanonizeManager,code:string) {
     super(canonizeManager.getTokenFactory(),[new Reference(canonizeManager.getSandra().get(BlockchainTokenFactory.ID),code)]);
 }

    public bindToAssetWithContract(contract:BlockchainContract,asset: Asset){

        let sandra = contract.factory.sandraManager ;

        this.factory.joinFactory(contract.factory,'self');
        this.joinEntity(contract.subjectConcept.shortname,asset,this.factory.sandraManager);


        //we need to specify for that contract that asset are bound not only on the contract but with explicit tokenpath
        contract.addReference(new Reference(sandra.get(BlockchainContractFactory.EXPLICIT_TOKEN_LISTING_SHORTNAME),'1'));



        //this.setTriplet(contract.subjectConcept.shortname, tokenPath, this.sandra);
    }

}