import {Entity} from "../../Entity.js";
import {ContractStandardFactory} from "../ContractStandardFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {Reference} from "../../Reference.js";
import {ContractStandard} from "../ContractStandard.js";

export class RmrkContractStandard extends ContractStandard{

    sandra:SandraManager

    constructor(sandra:SandraManager,tokenSn?:string) {
        let factory = new ContractStandardFactory(sandra);
        super(factory);

        this.sandra = sandra ;

        //we need to bind the the standard to the CSCannon class
        this.addReference(new Reference(sandra.get('class_name'),"CsCannon\\\Blockchains\\\Interfaces\\\RmrkContractStandard"));

        if (tokenSn) {
            this.setSn(tokenSn);

        }

    }

    public setSn(value:string){

        this.setSpecifierValue(this.sandra.get('sn'),value);

    }







}