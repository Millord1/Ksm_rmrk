import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainAddress} from "./BlockchainAddress.js";
import {BlockchainContract} from "./BlockchainContract.js";

export class BlockchainContractFactory extends EntityFactory{


    public contained_in_file:string = 'blockchainContractFile';
    private sandra:SandraManager ;


    public constructor(sandra:SandraManager) {

        super('blockchainContract','blockchainContractFile',sandra);
        this.sandra = sandra ;
        this.updateOnExistingRef = sandra.get('id');
    }

    public getOrCreate(id:string):BlockchainContract{
        if (this.entityByRevValMap.has(this.sandra.get('id'))){
            let addressRefMap = this.entityByRevValMap.get(this.sandra.get('id'));

            if (addressRefMap && addressRefMap.has(id)){
                //address exists in factory
                // @ts-ignore
                return addressRefMap.get(id);
            }

        }

        return new BlockchainContract(this,id,this.sandra);



    }



}