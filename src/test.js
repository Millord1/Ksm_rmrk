"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WestEnd_1 = require("./Blockchains/WestEnd");
const Jetski_1 = require("./Jetski/Jetski");
const StartScan_1 = require("./Jetski/StartScan");
async function launchScan() {
    const chain = new WestEnd_1.WestEnd();
    const blockNumber = 5011275;
    const chainName = "westend";
    const currentBlock = 0;
    const jetski = new Jetski_1.Jetski(chain);
    let api = await jetski.getApi();
    StartScan_1.startJetskiLoop(jetski, api, currentBlock, blockNumber, 0, chainName);
}
launchScan();
//# sourceMappingURL=test.js.map