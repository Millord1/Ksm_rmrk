import {Entity} from "../../Entity.js";
import {ContractStandardFactory} from "../ContractStandardFactory.js";
import {SandraManager} from "../../SandraManager.js";
import {Reference} from "../../Reference.js";
import {ContractStandard} from "../ContractStandard.js";
import {CSCanonizeManager} from "../CSCanonizeManager.js";

export class UniqueContractStandard extends ContractStandard{
    public getDisplayStructure(): string {

        return "tokenId-"+this.getTokenId();

    }

    sandra:SandraManager

    constructor(canonizeManager:CSCanonizeManager,tokenTokenId?:string) {
        let factory = canonizeManager.getContractStandardFactory();
        super(factory);

        this.sandra = canonizeManager.getSandra() ;

        //we need to bind the the standard to the CSCannon class
        this.addReference(new Reference(canonizeManager.getSandra().get('class_name'),"CsCannon\\\Blockchains\\\Substrate\\\Unique\\\UniqueContractStandard"));

        if (tokenTokenId) {
            this.setTokenId(tokenTokenId);

        }

    }

    public setTokenId(value:string){

        this.setSpecifierValue(this.sandra.get('tokenId'),value);

    }

    public getTokenId():string{

        if (!this.getSpecifierArray().get(this.sandra.get('tokenId')))  throw new Error("tokenId not specified for unique contract");

       return <string>this.getSpecifierArray().get(this.sandra.get('tokenId'));

    }











}