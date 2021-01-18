import {Entity} from "../../Entity.js";
import {ContractStandardFactory} from "../ContractStandardFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {Reference} from "../../Reference.js";

export class RmrkContractStandard extends Entity{

    constructor(sandra:SandraManager) {
        let factory = new ContractStandardFactory(sandra);
        super(factory);

        //we need to bind the the standard to the CSCannon class
        this.addReference(new Reference(sandra.get('class_name'),"CsCannon\\\Blockchains\\\Interfaces\\\RmrkContractStandard"))
    }





}