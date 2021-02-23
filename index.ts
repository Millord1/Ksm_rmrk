
import {scanOneBlock, testScan} from "./StartScan.js";
import {defaultWalker} from "./scenarios.js";
import {testJetski} from "./Tests/JetskiTests.js";

const {program} = require('commander');

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .action(testScan);

program.command("story")
    .action(defaultWalker);

program.command("tests").action(testJetski);

program.command("scan")
    .option("--block <block>", "Block number")
    .action(scanOneBlock);

program.parse(process.argv);