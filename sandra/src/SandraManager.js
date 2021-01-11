"use strict";
exports.__esModule = true;
exports.SandraManager = void 0;
var EntityFactory_js_1 = require("./EntityFactory.js");
var Concept_js_1 = require("./Concept.js");
var Entity_js_1 = require("./Entity.js");
var Reference_js_1 = require("./Reference.js");
var Gossiper_js_1 = require("./Gossiper.js");
var BlockchainEvent_js_1 = require("./CSCannon/BlockchainEvent.js");
var BlockchainAddress_js_1 = require("./CSCannon/BlockchainAddress.js");
var BlockchainContract_js_1 = require("./CSCannon/BlockchainContract.js");
var Blockchain_js_1 = require("./CSCannon/Blockchain.js");
var EthereumBlockchain_1 = require("./CSCannon/Ethereum/EthereumBlockchain");
var SandraManager = /** @class */ (function () {
    function SandraManager() {
        this.name = 'helloWalid';
        this.invisible = null;
        this.conceptList = [];
        this.entityList = [];
        this.refList = [];
        this.conceptMap = new Map();
        this.entityMap = new Map();
        this.registerNewConcept('null_concept');
    }
    SandraManager.prototype.registerNewConcept = function (shortname) {
        var conceptId = this.conceptList.length;
        var concept = new Concept_js_1.Concept(conceptId, shortname);
        this.conceptMap.set(concept.shortname, concept);
        this.conceptList.push(concept);
        return concept;
    };
    SandraManager.prototype.registerNewEntity = function (entity) {
        entity.id = this.entityList.length;
        this.entityMap.set(entity.id, entity);
        this.entityList.push(entity);
        return entity;
    };
    SandraManager.prototype.registerNewReference = function (ref) {
        ref.refId = this.refList.length;
        this.refList.push(ref);
        return ref;
    };
    SandraManager.prototype.get = function (shortname) {
        if (this.conceptMap.get(shortname))
            return this.conceptMap.get(shortname);
        return this.registerNewConcept(shortname);
    };
    SandraManager.prototype.demo = function () {
        var entityFactory = new EntityFactory_js_1.EntityFactory('cat', 'testFile', this);
        var felix = new Entity_js_1.Entity(entityFactory, [
            new Reference_js_1.Reference(this.get('name'), 'felix'),
            new Reference_js_1.Reference(this.get('age'), '3')
        ]);
        var miaous = new Entity_js_1.Entity(entityFactory, [
            new Reference_js_1.Reference(this.get('name'), 'miaous'),
            new Reference_js_1.Reference(this.get('age'), '10')
        ]);
        var ownerFactory = new EntityFactory_js_1.EntityFactory("person", 'peopleFile', this);
        var mike = new Entity_js_1.Entity(ownerFactory).addReference(new Reference_js_1.Reference(this.get('name'), 'mike'));
        var jown = new Entity_js_1.Entity(ownerFactory).addReference(new Reference_js_1.Reference(this.get('name'), 'jown'));
        entityFactory.joinFactory(ownerFactory, 'hasMaster', this.get('name'));
        entityFactory.joinFactory(entityFactory, 'friendWith', this.get('name'));
        felix.joinEntity(mike, 'hasMaster', this);
        felix.joinEntity(jown, 'hasMaster', this);
        felix.joinEntity(miaous, 'friendWith', this);
        var gossiper = new Gossiper_js_1.Gossiper(entityFactory, this.get('name'));
        console.log(JSON.stringify(gossiper.exposeGossip()));
        console.log(this.conceptList);
        console.log(this.entityList);
        console.log(this.refList);
    };
    SandraManager.prototype.cannonDemo = function (connector) {
        var blockchain = new EthereumBlockchain_1.EthereumBlockchain(this);
        var blockchainEventFactory = blockchain.eventFactory;
        var source = new BlockchainAddress_js_1.BlockchainAddress(blockchain.addressFactory, 'MyFirstAddress', this);
        var destination = new BlockchainAddress_js_1.BlockchainAddress(blockchain.addressFactory, 'MysecondAddress', this);
        var contract = new BlockchainContract_js_1.BlockchainContract(blockchain.contractFactory, 'myContract', this);
        var event1 = new BlockchainEvent_js_1.BlockchainEvent(blockchainEventFactory, source, destination, contract, 'myTX', '11111111', "1", blockchain, this);
        var gossiper = new Gossiper_js_1.Gossiper(blockchainEventFactory, this.get(Blockchain_js_1.Blockchain.TXID_CONCEPT_NAME));
        connector.gossip(gossiper).then(function (r) { console.log(r); });
    };
    return SandraManager;
}());
exports.SandraManager = SandraManager;
//# sourceMappingURL=SandraManager.js.map