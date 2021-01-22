import {Entity} from "../../Entity.js";
import {ContractStandardFactory} from "../ContractStandardFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {Reference} from "../../Reference.js";
import {ContractStandard} from "../ContractStandard.js";
import {CSCanonizeManager} from "../CSCanonizeManager.js";

export class RmrkContractStandard extends ContractStandard{
    public getDisplayStructure(): string {

        return "sn-"+this.getSn();

    }

    sandra:SandraManager

    constructor(canonizeManager:CSCanonizeManager,tokenSn?:string) {
        let factory = canonizeManager.getContractStandardFactory();
        super(factory);

        this.sandra = canonizeManager.getSandra() ;

        //we need to bind the the standard to the CSCannon class
        this.addReference(new Reference(canonizeManager.getSandra().get('class_name'),"CsCannon\\\Blockchains\\\Interfaces\\\RmrkContractStandard"));

        if (tokenSn) {
            this.setSn(tokenSn);

        }

    }

    public setSn(value:string){

        this.setSpecifierValue(this.sandra.get('sn'),value);

    }

    public getSn():string{

        if (!this.getSpecifierArray().get(this.sandra.get('sn')))  throw new Error("Sn not specified for rmrk token");

       return <string>this.getSpecifierArray().get(this.sandra.get('sn'));

    }











}