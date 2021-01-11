import {Kusama} from "./classes/Blockchains/Kusama";
import {Polkadot} from "./classes/Blockchains/Polkadot";
import {Unique} from "./classes/Blockchains/Unique";
import {ScanBlock} from "./Kusama/ScanBlock";
import {Option} from "commander";


export const testScan = async (opts: Option) => {

    let blockchain;

    // @ts-ignore
    switch (opts.chain.toLowerCase()){

        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            blockchain = new Unique();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;
    }


    const scan = new ScanBlock(blockchain);
    // @ts-ignore
    return scan.getRmrks(opts.block);
}
