"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Asset_js_1 = require("../../Asset.js");
const CSCanonizeManager_js_1 = require("../../../sandra/src/CSCannon/CSCanonizeManager.js");
const KusamaBlockchain_js_1 = require("../../../sandra/src/CSCannon/Kusama/KusamaBlockchain.js");
const RmrkContractStandard_js_1 = require("../../../sandra/src/CSCannon/Interfaces/RmrkContractStandard.js");
const Gossiper_js_1 = require("../../../sandra/src/Gossiper.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
class MintNft extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, MintNft.name, chain, null, transaction);
        this.nft = Asset_js_1.Asset.createNftFromInteraction(rmrk, chain, transaction);
        const issuer = this.transaction.source;
        this.transaction.source = '0x0';
        this.transaction.destination.address = issuer;
    }
    // public createMintNft(){
    //
    //     // @ts-ignore
    //     const myNft = new Asset(this.rmrk, this.chain, null, this.signer.address);
    //     this.myNft = myNft.createNftFromInteraction();
    //
    //     return this;
    // }
    toJson() {
        const json = this.nft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
    // to remove of course TODO
    shabanHackToDispachImediately() {
        return __awaiter(this, void 0, void 0, function* () {
            let canonizeManager = new CSCanonizeManager_js_1.CSCanonizeManager();
            let sandra = canonizeManager.getSandra();
            let contractId = this.nft.token.contractId;
            let kusama = new KusamaBlockchain_js_1.KusamaBlockchain(sandra);
            let nft = this.nft;
            //find image url
            let metadataIpfs = this.nft.metadata;
            metadataIpfs = metadataIpfs.replace('ipfs/', '');
            const url = "https://ipfs.io/ipfs/" + metadataIpfs;
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status === 200) {
                    //convert image url
                    let response = JSON.parse(xhr.responseText);
                    let image = response.image.replace("ipfs://", 'https://ipfs.io/');
                    let myAsset = canonizeManager.createAsset({ assetId: contractId + '-' + response.name, imageUrl: image });
                    let myCollection = canonizeManager.createCollection({ id: contractId, imageUrl: image, name: contractId, description: 'lorem' });
                    myAsset.bindCollection(myCollection);
                    myCOntract.bindToCollection(myCollection);
                    let rmrkToken = new RmrkContractStandard_js_1.RmrkContractStandard(canonizeManager);
                    rmrkToken.setSn(nft.token.sn);
                    let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);
                    tokenPath.bindToAssetWithContract(myCOntract, myAsset);
                    let gossiper = new Gossiper_js_1.Gossiper(canonizeManager.getTokenFactory());
                    let result = gossiper.exposeGossip();
                    let json = JSON.stringify(result, null, 2); // pretty
                    console.log(json);
                    const xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.send(json);
                    xmlhttp.addEventListener("load", () => {
                        console.log("complete");
                    });
                }
                else {
                    console.log("fail fetching ipfs" + url);
                }
            };
            xhr.send();
            let myCOntract = kusama.contractFactory.getOrCreate(contractId);
        });
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map