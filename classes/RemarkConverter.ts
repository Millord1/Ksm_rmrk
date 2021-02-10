
import {Asset} from "../sandra/src/CSCannon/Asset.js";
import {Blockchain} from "../sandra/src/CSCannon/Blockchain.js";
import {SandraManager} from "../sandra/src/SandraManager.js";
import {AssetFactory} from "../sandra/src/CSCannon/AssetFactory.js";
import {Transaction} from "./Transaction.js";
import {Blockchain as rmrkChain} from "./Blockchains/Blockchain.js";
import {Polkadot} from "./Blockchains/Polkadot.js";
import {Unique} from "./Blockchains/Unique.js";
import {Kusama} from "./Blockchains/Kusama.js";
import {Remark} from "./Rmrk/Remark.js";
import {Send} from "./Rmrk/Interactions/Send.js";
import {MintNft} from "./Rmrk/Interactions/MintNft.js";
import {Interaction} from "./Rmrk/Interaction.js";
import {CSCanonizeManager} from "../sandra/src/CSCannon/CSCanonizeManager.js";
import {getJwt} from "../StartScan.js";
import {BlockchainTokenFactory} from "../sandra/src/CSCannon/BlockchainTokenFactory.js";
import {AssetRmrk, CollectionRmrk} from "./Interfaces.js";
import {Collection} from "./Collection.js";
import {Entity} from "./Rmrk/Entity.js";
import {Asset as rmrkAsset} from "./Asset.js";
import {Mint} from "./Rmrk/Interactions/Mint.js";
import {stringToHex} from "@polkadot/util";


export class RemarkConverter
{

    private collectionToRmrk: CollectionRmrk = {
        version: "",
        name: "",
        max: 0,
        issuer: "",
        symbol: "",
        id: "",
        metadata: ""
    }

    private assetToRmrk: AssetRmrk = {
        collection: "",
        name: "",
        transferable: null,
        sn: "",
        metadata: "",
        id: ""
    }


    constructor() {
    }


    public getChain(chain: string): rmrkChain{

        let blockchain: rmrkChain;

        switch(chain.toLowerCase()){
            case "polkadot":
                blockchain = new Polkadot();
                break;

            case "unique":
                // TODO remake Unique Blockchain
                //@ts-ignore
                blockchain = new Unique();
                break;

            case "kusama":
            default:
                blockchain = new Kusama();
                break;
        }

        return blockchain;
    }


    public createSendRemark(asset: Asset, chain: Blockchain, sandra: SandraManager, owner: string, receiver: string){

        const jwt = getJwt();

        let canonizeManager = new CSCanonizeManager({connector:{gossipUrl:'http://arkam.everdreamsoft.com/alex/gossip',jwt:jwt}});

        const metaUrl = asset.getRefValue(sandra.get(AssetFactory.metaDataUrl));
        console.log('metaUrl ' + metaUrl);
        const assetId = asset.getRefValue(sandra.get(AssetFactory.ID));
        console.log('ID ' + assetId);

        // let token = canonizeManager.getAssetFactory().;

        // TODO
        // const factory = asset.subjectConcept.triplets.get(sandra.get(AssetFactory.collectionJoinVerb));
        // if(factory != undefined){
        //     console.log(sandra.entityMap.get(factory[0].unid));
        // }
        //
        // console.log(factory);

        const assetData = assetId.split('-');
        let assetName: string = assetData[1];
        let collectionId : string = assetData[0];

        const blockchain = this.getChain(chain.name);

        const entity = Remark.entityObj;
        entity.name = assetName;
        entity.collection = collectionId;

        const tx = Transaction.createTransaction(owner, receiver, blockchain);



    }


    public getObjectForRmrk(entity: Entity): CollectionRmrk|AssetRmrk|null{

        if(entity instanceof Collection){

            const collection = this.collectionToRmrk;
            collection.version = entity.version;
            collection.name = entity.name;
            collection.max = entity.contract.max;
            collection.issuer = entity.transaction.source;
            collection.symbol = entity.contract.symbol;
            collection.id = entity.contract.id;
            collection.metadata = entity.metaDataContent?.url;

            return collection;

        }else if(entity instanceof rmrkAsset){

            const asset = this.assetToRmrk;
            asset.collection = entity.token.contractId;
            asset.name = entity.name
            asset.transferable = entity.token.transferable;
            asset.sn = entity.token.sn;
            asset.metadata = entity.metaDataContent?.url;
            asset.id = entity.assetId;

            return asset;

        }else{
            return null;
        }

    }



    public toRmrk(interaction: Interaction): string{

        if(interaction instanceof Send){

            // const computedId = Interaction.getComputedId(interaction.nft);
            const computedId = interaction.nft.assetId;
            const destination = interaction.transaction.destination.address;
            return 'rmrk::' + Send.name + '::' + computedId + '::' + destination;

        }else if(interaction instanceof MintNft){

            const asset = this.getObjectForRmrk(interaction.nft);
            if(asset != null){
                return 'rmrk::' + MintNft.name + '::' + interaction.version + '::' + RemarkConverter.objToUri(asset);
            }

        }else if(interaction instanceof Mint){

            const collection = this.getObjectForRmrk(interaction.collection);
            if(collection != null){
                return 'rmrk::' + Mint.name + '::' + interaction.version + '::' + RemarkConverter.objToUri(collection);
            }

        }

        return "";
    }


    public toHexRmrk(interaction: Interaction): string{
        return stringToHex(this.toRmrk(interaction));
    }

    private static objToUri(obj: CollectionRmrk|AssetRmrk): string{
        const toEncode = JSON.stringify(obj);
        return encodeURIComponent(toEncode);
    }


}