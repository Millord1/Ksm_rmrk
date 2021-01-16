"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubstrateChain = void 0;
const Blockchain_js_1 = require("./Blockchain.js");
const Polkadot_js_1 = require("./Polkadot.js");
const fs = require('fs');
const path = require('path');
class SubstrateChain extends Blockchain_js_1.Blockchain {
    constructor(name, symbol, prefix, isSubstrate, wsProvider) {
        super(name, symbol, prefix, isSubstrate, wsProvider);
        this.checkSubstrate();
    }
    checkSubstrate() {
        if (this.isSubstrate) {
            const chains = fs.readFileSync(path.resolve(__dirname, "substrates.json"));
            const blockchains = JSON.parse(chains);
            for (const [blockchain, substrates] of Object.entries(blockchains)) {
                // @ts-ignore
                for (let substrate of substrates) {
                    if (substrate.name === this.name) {
                        this.substrateOf = this.getClassFromString(blockchain);
                    }
                }
            }
        }
    }
    getClassFromString(name) {
        name = name.toLowerCase();
        switch (name) {
            case 'polkadot':
                return new Polkadot_js_1.Polkadot();
        }
    }
}
exports.SubstrateChain = SubstrateChain;
//# sourceMappingURL=SubstrateChain.js.map