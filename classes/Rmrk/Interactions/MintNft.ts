import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Asset} from "../../Asset.js";
import {Transaction} from "../../Transaction.js";
import {CSCanonizeManager} from "../../../sandra/src/CSCannon/CSCanonizeManager.js";
import {KusamaBlockchain} from "../../../sandra/src/CSCannon/Kusama/KusamaBlockchain.js";
import {RmrkContractStandard} from "../../../sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {Gossiper} from "../../../sandra/src/Gossiper.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export class MintNft extends Interaction
{
    nft: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction){
        super(rmrk, MintNft.name, chain, null, transaction);
        this.nft = Asset.createNftFromInteraction(rmrk,chain,transaction);

        const issuer = this.transaction.source;
        this.transaction.source = '0x0';
        this.transaction.destination.address = issuer;
    }

    public toJson(){
        const json = this.nft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }

    // to remove of course TODO
    // private async shabanHackToDispachImediately(){
    //
    //     let canonizeManager = new CSCanonizeManager();
    //     let sandra = canonizeManager.getSandra();
    //
    //     let contractId = this.nft.token.contractId;
    //
    //
    //     let kusama = new KusamaBlockchain(sandra);
    //
    //     let nft = this.nft ;
    //
    //     //find image url
    //     let metadataIpfs = this.nft.metadata ;
    //     metadataIpfs = metadataIpfs.replace('ipfs/','');
    //
    //     const url = "https://ipfs.io/ipfs/"+metadataIpfs;
    //
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('GET', url, true);
    //     xhr.responseType = 'json';
    //     xhr.onload = function() {
    //         var status = xhr.status;
    //         if (status === 200) {
    //
    //             //convert image url
    //             let response = JSON.parse(xhr.responseText);
    //             let image = response.image.replace("ipfs://",'https://ipfs.io/')
    //
    //
    //             let myAsset = canonizeManager.createAsset({assetId:contractId+'-'+response.name,imageUrl:image});
    //             let myCollection = canonizeManager.createCollection({id:contractId,imageUrl:image,name:contractId,description:'lorem'});
    //
    //
    //             myAsset.bindCollection(myCollection);
    //             myCOntract.bindToCollection(myCollection);
    //
    //             let rmrkToken = new RmrkContractStandard(canonizeManager);
    //             rmrkToken.setSn(nft.token.sn);
    //             let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);
    //
    //             tokenPath.bindToAssetWithContract(myCOntract,myAsset);
    //
    //             let gossiper = new Gossiper(canonizeManager.getTokenFactory());
    //             let result = gossiper.exposeGossip();
    //
    //             let json = JSON.stringify(result,null,2); // pretty
    //             console.log(json);
    //
    //             const xmlhttp = new XMLHttpRequest();
    //             xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
    //             xmlhttp.setRequestHeader("Content-Type", "application/json");
    //             xmlhttp.send(json);
    //             xmlhttp.addEventListener("load", ()=>{
    //                 console.log("complete");
    //             });
    //
    //
    //
    //         } else {
    //         console.log("fail fetching ipfs"+url);
    //         }
    //     };
    //     xhr.send();
    //
    //
    //
    //     let myCOntract = kusama.contractFactory.getOrCreate(contractId);
    //
    //
    //
    //
    // }
}