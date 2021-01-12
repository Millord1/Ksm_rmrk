import { BlockchainAddressFactory } from "./BlockchainAddressFactory.js";
import { BlockchainContractFactory } from "./BlockchainContractFactory.js";
import { BlockchainEventFactory } from "./BlockchainEventFactory.js";
var Blockchain = /** @class */ (function () {
    function Blockchain(sandra) {
        this.addressFactory = new BlockchainAddressFactory(sandra);
        this.contractFactory = new BlockchainContractFactory(sandra);
        this.eventFactory = new BlockchainEventFactory(this, sandra);
    }
    Blockchain.TXID_CONCEPT_NAME = 'txid';
    return Blockchain;
}());
export { Blockchain };
