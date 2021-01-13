import { EntityFactory } from "./EntityFactory.js";
import { Concept } from "./Concept.js";
import { Entity } from "./Entity.js";
import { Reference } from "./Reference.js";
import { Gossiper } from "./Gossiper.js";
import { BlockchainEvent } from "./CSCannon/BlockchainEvent.js";
import { BlockchainAddress } from "./CSCannon/BlockchainAddress.js";
import { BlockchainContract } from "./CSCannon/BlockchainContract.js";
import { Blockchain } from "./CSCannon/Blockchain.js";
import { EthereumBlockchain } from "./CSCannon/Ethereum/EthereumBlockchain.js";
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
        var concept = new Concept(conceptId, shortname);
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
        var entityFactory = new EntityFactory('cat', 'testFile', this);
        var felix = new Entity(entityFactory, [
            new Reference(this.get('name'), 'felix'),
            new Reference(this.get('age'), '3')
        ]);
        var miaous = new Entity(entityFactory, [
            new Reference(this.get('name'), 'miaous'),
            new Reference(this.get('age'), '10')
        ]);
        var ownerFactory = new EntityFactory("person", 'peopleFile', this);
        var mike = new Entity(ownerFactory).addReference(new Reference(this.get('name'), 'mike'));
        var jown = new Entity(ownerFactory).addReference(new Reference(this.get('name'), 'jown'));
        entityFactory.joinFactory(ownerFactory, 'hasMaster', this.get('name'));
        entityFactory.joinFactory(entityFactory, 'friendWith', this.get('name'));
        felix.joinEntity(mike, 'hasMaster', this);
        felix.joinEntity(jown, 'hasMaster', this);
        felix.joinEntity(miaous, 'friendWith', this);
        var gossiper = new Gossiper(entityFactory, this.get('name'));
        console.log(JSON.stringify(gossiper.exposeGossip()));
        console.log(this.conceptList);
        console.log(this.entityList);
        console.log(this.refList);
    };
    SandraManager.prototype.cannonDemo = function (connector) {
        var blockchain = new EthereumBlockchain(this);
        var blockchainEventFactory = blockchain.eventFactory;
        var source = new BlockchainAddress(blockchain.addressFactory, 'MyFirstAddress', this);
        var destination = new BlockchainAddress(blockchain.addressFactory, 'MysecondAddress', this);
        var contract = new BlockchainContract(blockchain.contractFactory, 'myContract', this);
        var event1 = new BlockchainEvent(blockchainEventFactory, source, destination, contract, 'myTX', '11111111', "1", blockchain, this);
        var gossiper = new Gossiper(blockchainEventFactory, this.get(Blockchain.TXID_CONCEPT_NAME));
        connector.gossip(gossiper).then(function (r) { console.log(r); });
    };
    return SandraManager;
}());
export { SandraManager };
