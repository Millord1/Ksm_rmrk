import {Blockchain} from "./Blockchain.js";
import {Polkadot} from "./Polkadot.js";
import {BlockchainAddress} from "../Addresses/BlockchainAddress.js";
const fs = require('fs');
const path = require('path');

export abstract class SubstrateChain extends Blockchain
{

    substrateOf: Blockchain | undefined;

    protected constructor(name: string, symbol: string, prefix: string, isSubstrate: boolean, addressClass: BlockchainAddress, wsProvider: string) {
        super(name, symbol, prefix, isSubstrate, addressClass, wsProvider);
        this.checkSubstrate();
    }

    private checkSubstrate(){

        if(this.isSubstrate){
            const chains = fs.readFileSync(path.resolve(__dirname, "substrates.json"));
            const blockchains = JSON.parse(chains);

            for (const [blockchain, substrates] of Object.entries(blockchains)){
                // @ts-ignore
                for(let substrate of substrates){
                    if(substrate.name === this.name){
                        this.substrateOf = this.getClassFromString(blockchain);
                    }
                }
            }
        }

    }


    public getClassFromString(name: string){

        name = name.toLowerCase();

        switch (name){
            case 'polkadot':
                return new Polkadot();
        }

    }


}