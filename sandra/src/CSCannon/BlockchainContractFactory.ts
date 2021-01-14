import {EntityFactory} from "../EntityFactory.js";
import {SandraManager} from "../SandraManager.js";
import {BlockchainAddress} from "./BlockchainAddress.js";
import {BlockchainContract} from "./BlockchainContract.js";

export class BlockchainContractFactory extends EntityFactory{


    public contained_in_file:string = 'blockchainContractFile';
    private sandra:SandraManager ;
    private test ;

    public constructor(sandra:SandraManager) {

        super('blockchainContract','blockchainContractFile',sandra);
        this.sandraManager = sandra ;
    }

    public getOrCreate(id:string){
        if (this.entityByRevValMap.has(this.sandra.get('id'))){
            let addressRefMap = this.entityByRevValMap.get(this.sandra.get('id'));

            if (addressRefMap.has(id)){
                //address exists in factory
                return addressRefMap.get(id);
            }

        }

        return new BlockchainContract(this,id,this.sandra);



    }



}