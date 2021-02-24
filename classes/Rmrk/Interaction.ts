import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {Asset} from "../Asset.js";
import {EntityInterface, PublicInteraction} from "../Interfaces.js";
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

        const sn = computed.split('-')[4];
        const assetId = computed.replace('-'+sn, '');

        return new Asset(this.rmrk, this.chain, this.version, this.transaction, nftDatas, assetId, meta);
    }


    public static getComputedId(asset: Asset): string{

        const blockId = asset.transaction.blockId;
        const collectionId = asset.token.contractId;
        const instance = asset.instance;
        const sn = asset.token.sn;

        return blockId + '-' + collectionId + '-' + instance + '-' + sn;

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

        }else
            if (this.version === "1.0.0" || this.version === "RMRK1.0.0")
            {
            // Normalization

            if(data.length === 4){
                obj.collection = data[1] + '-' + data[2];
                obj.name = data[2];

                obj.sn = data[3].match(/^[0-9]{16}/) ? data[3] : '';

            }else if(data.length > 4){
                obj.collection = data[1] + '-' + data[2];
                obj.name = data[3];
                // obj.sn = data[data.length - 1];
                obj.sn = data[data.length - 1].match(/^[0-9]{16}/) ? data[data.length - 1] : '';
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