import {WestEnd} from "./Blockchains/WestEnd";
import {Jetski} from "./Jetski/Jetski";
import {ApiPromise} from "@polkadot/api";
import {startJetskiLoop} from "./Jetski/StartScan";


async function launchScan()
{
    const chain = new WestEnd();
    const blockNumber = 5011275;
    const chainName = "westend";

    const currentBlock: number = 0;

    const jetski = new Jetski(chain);
    let api: ApiPromise = await jetski.getApi();

    startJetskiLoop(jetski, api, currentBlock, blockNumber, chainName);
}

launchScan();