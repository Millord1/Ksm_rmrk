import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {Asset} from "../Asset.js";
import {AssetRmrk, CollectionRmrk, EntityInterface, PublicInteraction} from "../Interfaces.js";
import {Transaction} from "../Transaction.js";
import {Metadata} from "../Metadata.js";


export abstract class Interaction extends Remark implements PublicInteraction
{

    interaction: string;


    protected constructor(rmrk: string, interaction:string, chain: Blockchain, version: string|null, transaction: Transaction) {
        super(version, rmrk, chain, transaction);
        this.interaction = interaction
    }


    public rmrkToArray(){
        return this.rmrk.split('::');
    }


    public nftFromComputedId(computed: string, meta: Metadata|null){

        let nftDatas = this.checkDatasLength(computed.split('-'));

        return new Asset(this.rmrk, this.chain, this.version, this.transaction, nftDatas, meta);
    }


    public static getComputedId(asset: Asset): string{

        const blockId = asset.transaction.blockId;
        const collectionId = asset.token.contractId;
        const assetName = asset.name;
        const sn = asset.token.sn;

        return blockId + '-' + collectionId + '-' + assetName + '-' + sn;

    }



    private checkDatasLength(data: Array<string>): EntityInterface{

        const obj = Remark.entityObj;

        if(this.version === 'RMRK0.1' || this.version === "0.1"){
            // Not allowed

            let collection: string = "";

            obj.sn = data[data.length -1];
            data.splice(data.length -1, 1);

            obj.name = data[data.length -1];
            data.splice(data.length -1, 1);

            for (let i = 0; i<data.length; i++){
                if(i != data.length-1){
                    collection += data[i] + '-';
                }else{
                    collection += data[i];
                }
            }

            obj.collection = collection;

        }
        else
            if (this.version === "1.0.0"){
            // Normalization

            if(data.length === 4){
                obj.collection = data[1];
                obj.name = data[2];
                obj.sn = data[3];
            }

        }

        return obj;
    }


    toJsonSerialize = () : PublicInteraction => ({
       version : this.version,
       rmrk: this.rmrk,
        // @ts-ignore
       chain: this.chain.toJson(),
       interaction: this.interaction
    });

}