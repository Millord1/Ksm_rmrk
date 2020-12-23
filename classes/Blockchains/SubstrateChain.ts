import {Blockchain} from "./Blockchain";
import {Polkadot} from "./Polkadot";
const fs = require('fs');
const path = require('path');

export class SubstrateChain extends Blockchain
{

    substrateOf;

    constructor(name, symbol, prefix, isSubstrate) {
        super(name, symbol, prefix, isSubstrate);
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