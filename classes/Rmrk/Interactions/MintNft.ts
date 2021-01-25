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
    myNft: Asset;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction){
        super(rmrk, MintNft.name, chain, null, transaction);

        //const myNft = new Asset(this.rmrk, this.chain, null, transaction,this.rmrk);
        this.myNft = Asset.createNftFromInteraction(rmrk,chain,transaction);
        this.shabanHackToDispachImediately();
    }

    // public createMintNft(){
    //
    //     // @ts-ignore
    //     const myNft = new Asset(this.rmrk, this.chain, null, this.signer.address);
    //     this.myNft = myNft.createNftFromInteraction();
    //
    //     return this;
    // }

    public toJson(){
        const json = this.myNft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }

    // to remove of course TODO
    private async shabanHackToDispachImediately(){

        let canonizeManager = new CSCanonizeManager();
        let sandra = canonizeManager.getSandra();

        let contractId = this.myNft.token.contractId;


        let kusama = new KusamaBlockchain(sandra);

        let nft = this.myNft ;

        //find image url
        let metadataIpfs = this.myNft.metadata ;
        metadataIpfs = metadataIpfs.replace('ipfs/','');

        const url = "https://ipfs.io/ipfs/"+metadataIpfs;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {

                //convert image url
                let response = JSON.parse(xhr.responseText);
                let image = response.image.replace("ipfs://",'https://ipfs.io/')


                let myAsset = canonizeManager.createAsset({assetId:contractId+'-'+response.name,imageUrl:image});
                let myCollection = canonizeManager.createCollection({id:contractId,imageUrl:image,name:contractId,description:'lorem'});


                myAsset.bindCollection(myCollection);
                myCOntract.bindToCollection(myCollection);

                let rmrkToken = new RmrkContractStandard(canonizeManager);
                rmrkToken.setSn(nft.token.sn);
                let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);

                tokenPath.bindToAssetWithContract(myCOntract,myAsset);

                let gossiper = new Gossiper(canonizeManager.getTokenFactory());
                let result = gossiper.exposeGossip();

                let json = JSON.stringify(result,null,2); // pretty
                console.log(json);

                const xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.send(json);
                xmlhttp.addEventListener("load", ()=>{
                    console.log("complete");
                });



            } else {
            console.log("fail fetching ipfs"+url);
            }
        };
        xhr.send();



        let myCOntract = kusama.contractFactory.getOrCreate(contractId);




    }
}