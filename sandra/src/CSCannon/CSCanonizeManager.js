"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSCanonizeManager = void 0;
const SandraManager_js_1 = require("../SandraManager.js");
const AssetCollectionFactory_js_1 = require("./AssetCollectionFactory.js");
const AssetCollection_js_1 = require("./AssetCollection.js");
const AssetFactory_js_1 = require("./AssetFactory.js");
const Asset_js_1 = require("./Asset.js");
const BlockchainTokenFactory_js_1 = require("./BlockchainTokenFactory.js");
const ContractStandardFactory_js_1 = require("./ContractStandardFactory.js");
const EntityFactory_js_1 = require("../EntityFactory.js");
const Gossiper_js_1 = require("../Gossiper.js");
const Entity_js_1 = require("../Entity.js");
const Reference_js_1 = require("../Reference.js");
const AssetSolverFactory_js_1 = require("./AssetSolvers/AssetSolverFactory.js");
const LocalSolver_js_1 = require("./AssetSolvers/LocalSolver.js");
class CSCanonizeManager {
    constructor(options, sandra = new SandraManager_js_1.SandraManager()) {
        this.sandra = sandra;
        this.assetCollectionFactory = new AssetCollectionFactory_js_1.AssetCollectionFactory(sandra);
        this.assetFactory = new AssetFactory_js_1.AssetFactory(sandra);
        this.tokenFactory = new BlockchainTokenFactory_js_1.BlockchainTokenFactory(this);
        this.contractStandardFactory = new ContractStandardFactory_js_1.ContractStandardFactory(sandra);
        this.assetSolverFactory = new AssetSolverFactory_js_1.AssetSolverFactory(this);
        this.localSolver = new LocalSolver_js_1.LocalSolver(this);
        this.activeBlockchainFactory = new EntityFactory_js_1.EntityFactory('activeBlockchain', 'activeBlockchainFile', this.sandra, this.sandra.get('blockchain'));
        this.apiConnector = (options === null || options === void 0 ? void 0 : options.connector) ? options.connector : undefined;
    }
    createCollection(collectionInterface, solver) {
        let assetSolver = solver ? solver : this.localSolver;
        let collection = new AssetCollection_js_1.AssetCollection(this.assetCollectionFactory, collectionInterface, this.sandra);
        collection.joinEntity(AssetSolverFactory_js_1.AssetSolverFactory.COLLECTION_JOIN_VERB, assetSolver, this.sandra);
        return new AssetCollection_js_1.AssetCollection(this.assetCollectionFactory, collectionInterface, this.sandra);
    }
    createAsset(assetInterface) {
        return new Asset_js_1.Asset(this.assetFactory, assetInterface, this.sandra);
    }
    getAssetFactory() {
        return this.assetFactory;
    }
    getContractStandardFactory() {
        return this.contractStandardFactory;
    }
    getTokenFactory() {
        return this.tokenFactory;
    }
    getAssetCollectionFactory() {
        return this.assetCollectionFactory;
    }
    getSandra() {
        return this.sandra;
    }
    async gossipActiveBlockchain(apiConnector, flush) {
        if (apiConnector !== undefined) {
            let gossiper = new Gossiper_js_1.Gossiper(this.activeBlockchainFactory, this.sandra.get('blockchain'));
            let flushCall = await flush ? await gossiper.flushDatagraph(apiConnector) : null;
            return await gossiper.gossipToUrl(apiConnector);
        }
        if (this.apiConnector !== undefined) {
            let gossiper = new Gossiper_js_1.Gossiper(this.activeBlockchainFactory, this.sandra.get('blockchain'));
            let flushCall = await flush ? await gossiper.flushDatagraph(this.apiConnector) : null;
            return await gossiper.gossipToUrl(this.apiConnector);
        }
        throw new Error("No API connector set pass it into this function or on the constructor");
    }
    async flushWithBlockchainSupport(blockchains, apiConnector) {
        const result = await blockchains.forEach(blockchain => {
            let entity = new Entity_js_1.Entity(this.activeBlockchainFactory, [new Reference_js_1.Reference(this.sandra.get('blockchain'), blockchain.getName())]);
            entity.setTriplet('onBlockchain', blockchain.getName(), this.sandra);
            this.activeBlockchainFactory.addOrUpdateEntity(entity);
        });
        return this.gossipActiveBlockchain(apiConnector, true);
    }
    addBlockchainSupport(blockchains) {
        blockchains.forEach(blockchain => {
            let entity = new Entity_js_1.Entity(this.activeBlockchainFactory, [new Reference_js_1.Reference(this.sandra.get('blockchain'), blockchain.getName())]);
            entity.setTriplet('onBlockchain', blockchain.getName(), this.sandra);
            this.activeBlockchainFactory.addOrUpdateEntity(entity);
        });
    }
    getAssetSolverFactory() {
        return this.assetSolverFactory;
    }
    async gossipCollection(apiConnector) {
        let gossiper = new Gossiper_js_1.Gossiper(this.assetCollectionFactory);
        return gossiper.gossipToUrl(this.getApiConnector(apiConnector));
    }
    async gossipOrbsBindings(apiConnector) {
        let gossiper = null;
        //if the asset are bound directely to token we are going to dispatch that.
        if (this.tokenFactory.entityArray.length > 0) {
            console.log("There are token binding so we are publishing token binding");
            gossiper = new Gossiper_js_1.Gossiper(this.tokenFactory);
        }
        else {
            console.log("No token binding assets may be bound directely to contract");
            gossiper = new Gossiper_js_1.Gossiper(this.assetFactory);
        }
        return gossiper.gossipToUrl(this.getApiConnector(apiConnector));
    }
    async gossipBlockchainEvents(blockchain, apiConnector) {
        let gossiper = new Gossiper_js_1.Gossiper(blockchain.eventFactory);
        return gossiper.gossipToUrl(this.getApiConnector(apiConnector));
    }
    getApiConnector(apiConnector) {
        if (apiConnector !== undefined) {
            return apiConnector;
        }
        if (this.apiConnector !== undefined) {
            return this.apiConnector;
        }
        throw new Error("No API connector set pass it into this function or on the constructor");
    }
}
exports.CSCanonizeManager = CSCanonizeManager;
CSCanonizeManager.mintIssuerAddressString = '0x0000000000000000000000000000000000000000';
//# sourceMappingURL=CSCanonizeManager.js.map