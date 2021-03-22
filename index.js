"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StartScan_js_1 = require("./StartScan.js");
const scenarios_js_1 = require("./scenarios.js");
const JetskiTests_js_1 = require("./Tests/JetskiTests.js");
const { program } = require('commander');
program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .action(StartScan_js_1.testScan);
program.command("story")
    .action(scenarios_js_1.defaultWalker);
program.command("tests").action(JetskiTests_js_1.testJetski);
program.command("scan")
    .option("--chain <chain>", "blockchain name", "kusama")
    .option("--block <block>", "Block number")
    .action(StartScan_js_1.scanOneBlock);
program.parse(process.argv);
//# sourceMappingURL=index.js.map